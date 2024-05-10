## our echo-sever
The server is both a producer and a consumer, as is the client. If the client produces data faster then client consumes the encoded data (or the client does not consume and data at all), the server's memory will grow indefinitely if the server does not wait for writes to complete.
## socket programming
- No.1 beginner trap is socket programming is "concatenating and splitting TCP packet" because there is no such thing as "TCP packets".
- protocols are required to interpret TCP data by imposing boundaries withing the byte stream.
## Byte Stream va Packet: DNS as an Example
### implication of Byte Stream
- DNS runs on UDP, the client sends a single request message and the server responds with a single response message.
- A DNS message is encapsulated in a UDP packet.
- Due to drawbacks of packet-based protocols, e.g., the ability to use large messages, DNS is also designed to run on TCP. But TCP knows nothing about "message", so when sending DNS messages over TCP, a **2-byte length filed** is prepended to each DNS message so that the server or client can tell which part of the byte is stream is which message.
## TCP start with a Handshake
To establish a TCP connection, there should be a client and server. The server waits for the client at a specific address (IP + prot), this step is called *bind & listen*. Then the client can connect to the address. The "connect" operation involves a 3-step handshake (SYN, SYN-ACK, ACK) but this is not our concern because the OS does it transparently. After the OS completes the handshake, the connection can be accepted by the server.
## TCP Bidirectional and Full-Duplex
- TCP connection can be use as a bi-directional byte stream, with 2 channels of each direction. Each peer can send and receive at the same time (e.g. WebSocket), this is called *full-duplex-communication*.
## TCP End with 2 handshake
- A peer tells the other side that no more data wil lbe send with the FIN flag, then the other side ACKs the FIN. The remote application is notified of the termination when reading from the channel. Each direction of channels can be terminated independently, so the other side also performs the same handshake to *fully* close the connection.
# Socket
TCP connection is managed by operating system, and you use socket API socket handler to refer to that connection.
In NodeJS, socket handles are wrapped into JS objects with methods on them.
Any OS handle must be closed by the application to terminate the underlying resource and recycle the handle.
## Listening socket and Connection Socket
TCP connection listen of a particular address (IP + port) and accept client connections from that address. The listening address is also represented by a socket handle. And when you accept a new client connection, you get the socket handle of the TCP connection.
1. Listening Sockets: Obtained by *listening* on an address.
2. Connection Sockets: Obtained by *accepting* a client connection for the listening socket.
## End of Transmission
Send and receive are also called *read* and *write*. For the write side, there are ways to tell the peer that no more data will be sent.
- Closing the socket terminates a connection and causes the TCP FIN to be sent.
- You can also shutdown your side of the transmission (also send FIN) while still being able to receive data from the peer. This is called *half-open* connection.

For the read side, there are ways to know when the peer has ended the transmission (received FIN). The end of transmission is often called the *end of file* (EOF).
### Why we are waiting for "completion of the write"?
`socket.write()` is completed when the data is submitted to the OS
- Producers are Bottlenecked by Consumers: Whenever there is asynchronous communication, there are queues or buffers that connect producers to consumers. Queues and buffer in our physical world are bounded in size and cannot hold an infinite amount of data. One problem with asynchronous communication is that what happens when the producer is producing faster than the consumer is consuming? There must be a mechanism to prevent the queue or buffer from overflowing. This mechanism is often called *backpressure* in network applications.
#### Backpressure in TCP: Flow control
Backpressure in TCP is known as *flow control*.
- The consumer's TCP stack stores incoming data in a *receive buffer* for the application to consume.
- The amount of data the producer's TCP stack can send is bounded by a *window* known to the producer's TCP stack, and it will *pause* sending data when the window if full.
- The consumer's TCP stack manager the window; when the app drains from the receive buffer, it *move* the window forward and notifies the producer's TCP stack to *resume* sending.
>[NOTE] TCP flow control should not be confused with TCP congestion control, which also controls the window.
#### Backpressure Between Application & OS
The application produces data and submits it to the OS, the data goes to the send buffer, and the TCP stack consumes from the send buffer and transmits the data.
```
            write()  may block!
|producer| ========> |send buf| =====> ...
    app                OS        TCP
```
How does the OS prevent the send buffer from overflowing? Simple, the application cannot write more data when the buffer is full. Now the application is responsible for throttling itself from overproducing, because teh data has to go somewhere, but memory is finite.

if the application is doing blocking IO, the call will block when the send buffer is full, so backpressure is effortless. However, this is not the case when coding in JS with an event loop.

>[NOTE] Backpressure should exist in any system that connects producers to consumers. A rule of thumb is to look for unbounded queues in software systems, as they are a sign of the lack of backpressure.

the use of `socket.pause`. You can now understand why this is essential, because it is used to implement backpressure.

There is another reason to pause the `data` event. In callback-based code, when the event handler returns, the runtime can fire the next `data` event if it is not paused. The problem is that, **the completion of the event callback doesn't mean the completion of the event handling** the handling can continue with further callbacks. And the interleaved handling can cause problems, considering that the data is an ordered sequence of bytes. This situation is called *race condition* and is a class of problems related to concurrency. In this situation, unwanted concurrency is introduced.

This is why I switched to promise-based API, because of there are advantages.
- if you stick to promises and `async/await` it's harder to create the kind of race conditions, because things happen in order in promise-based API.
- With callback-based code, It's not only harder to figure out the order of code execution, it's also harder to control the order.
- Backpressure is naturally present wehn using the promise-based style. This is similar to coding with blocking IO (which you can't do in Node.js).
## Dynamic Buffers
Message do not come from the socket by themselves, we need to store the incoming data in a buffer, then we can try to split message from it.
A `Buffer` object in Node.JS is fixed-size chunk of binary data. It can not grow by appending data. What we can do is to concatenate 2 buffers into a new buffer.
``` javascript
buf = Buffer.concat([buf, data]);
```
### Coding a Dynamic Buffer
The buffer has to be larger then needed for the appended data to use the extra capacity to amortize the copying.
# API
### `newConnection` function
- args: socket of type `net.Socket`
takes a socket and register as callback to the `socket.on` "connection" listener.
The runtime will automatically perform the *accept* operation and invoke the callback with the new connection as an argument of they `net.Socket`. This callback is registered once, but will be called for each new connection.
### `soRead` function
- args conn of type `TCPConn`
the `soRead` function return a promise which is resolved with socket data. It depends on 3 events.
1. The `data` event fulfills the promise
2. While reading a socket, we also need to know if the EOF has occurred. So the `end` event also full fills the promise. A common way to indicate the EOF is to return zero-length data.
3. There is also the `error` event, we want ot reject the promise when this happens, otherwise, the promise hangs forever.
To resolve or reject the promise from these events, the promise has to be stored somewhere. We will create teh `TCPConn` wrapper object for this purpose.
### `soWrite` function
- args conn of type `net.Socket` and data of type `Buffer`
The `socket.write` method accepts a callback to notify the completion of the write.
### `cutMessage` function
The `cutMessage()` function tests if the message is complete using the delimiter `\n`. Then it makes a copy of the message data, because it will be removed from the buffer.
### `bufPop()` function
The message is removed by moving the remaining data to the front.
