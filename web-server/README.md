# echo-sever

## Why to pause on read and resume after read complete
The server is both a producer and a consumer, as is the client. If the client produces data faster then client consumes the encoded data (or the client does not consume and data at all), the server's memory will grow indefinitely if the server does not wait for writes to complete.

## how does a outer identifier have access of `resolve` and `rejects` function of `Promise`
What I did is create a `conn` identifier and assigned reference of the `resolve` and `reject` functions. So doing this I can call those functions with help of `conn`. But you can do it only once per conn object creation so I put it it in `soInit` when a new connection event occurs.

## Why `soRead` have a check for `conn.ended`
It is because a client can end it connection in between stream, when the server is reading once chunk of data and have not completed the reset and in between that client disconnected.
# HTTP implementation
## How I would determine the length of the HTTP Body
The length of the body is complicated because there are 3 ways to determine it. The first way is to use `Content-length`, which contains the length of the body.
Some ancient HTTP/1.0 software doesn't use `content-length`, so the body is just the rest of the connection data, the parser reads the socket of EOF and that's the body. This is the second way to determine the body length. This way is problematic because you cannot tell if the connection is ended prematurely.
## I took a approach of Chunked Transfer encoding
The way is to use `Transfer-Encoding: chunked` instead of `Content-length`. This is called *chunked transfer encoding*. It can mark the end of the payload without knowing its size in advance.
This allows the server to send the response while generating it on the fly. This use case is called *streaming*. An displaying a real-time to the client without waiting for the process to finish.
```
4\r\nHTTP\r\n5\r\nserver\r\n0\r\n\r\n
```
it is parsed into 3 chunks:
- 4\r\nHTTP\r\n : 4 is the HTTP length
- 6\r\nserver\r\n
- 0\r\n\r\n
So, this batter as Chunks start with the size of the data, and 0-sized chunk means end of the stream.

## Serialization Errors in Delimited data
one problem with delimiters is that the data cannot contain the delimiter itself. Failure to enforce this rule can lead to some injection exploits.
## What is found searching for delimiter solution
A proper HTTP server/client must forbid CRLF in header fields as there is no way to encode them. However, this is not true for many generic data formats. For example, JSON uses `{}[],:` to delimit elements, but a JSON string can contain arbitrary characters, so strings are *quoted* to avoid ambiguity with delimiters. But the quotes themselves are also delimiter, so *escape sequences* are needed to encode quotes.
This is why you need a JSON library to produce JSON instead of concatenating strings together.
## Length-Prefixed data is Binary protocols
Delimiters in text are used to separate elements. In binary protocols are formats, a better and simpler alternative is to use length-prefixed data, that is, to specify the length of th element before the element data. Some examples are:
- The chunked transfer encoding. Although the length itself is still delimited.
- The WebSocket frame format. No delimiters at all.
- The _MessagePack_ serialization format. Some kind of binary JSON.

## HTTP code
I used `Buffer` instead of `string` for the URI and header fields. Although HTTP is mostly plaintext, there is no guarantee the URI and header fields must be ASCII or UTF-8 strings. So we just leave them as bytes until we need to parse them.
## How I handled payload body
The server loop `serverClient()` Except that the `cutMessage()` function only parses the HTTP header, the payload body is expected to be read while handling the request, or discarded after handling the request. In this way, we don't store the entire payload body in memory.
Parsing is also easier when we have the complete data. That's another reason why we waited for the full HTTP header before parsing anything.

## Negle's Algorithm
When sending the response, I used the `encodeHTTPResp()` function to create a byte buffer of the header before writing the response to the socket. Some people may skip this step and write to the socket line by line
```javascript
// Bad example
await soWrite(conn, Buffer.from(`HTTP/1.1 ${msg} ${status}\r\n`));
for(const h of msg.headers){
    await soWrite(conn, h);
    await soWrite(conn, Buffer.from('\r\n'));
}
await soWrite(conn, Buffer.from('\r\n'));
```
I found the problem with this approach is that it generates many small writes, causing TCP to send many small packets. Not only does each packet have relatively large space overhead, but more computation is required to process more packets.
The **Negle's algorithm** -- the TCP stack *delay* transmission to allow the send buffer to accumulate data, so that multiple consecutive small writes can be combined.

What Know from this is well-written applications should manage buffers carefully, either by explicitly serializing data into a buffer, or by using some buffered IO interfaces, so that Negle's algorithm is not needed. And high-performance applications will want to minimize the number of syscalls.
When developing networked applications:
1. Avoid small writes by combining small data before writing.
2. Disable Negle's algorithm.
Negal's algorithm is often enabled by default. This can be disabled using the `noDelay` flag in Node.js.
```javascript
const server = net.createServer({noDelay: true});
```
