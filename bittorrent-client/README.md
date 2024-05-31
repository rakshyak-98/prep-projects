## Overview of bittorrent
- you need to send a request to something called **tracker**, and tracker will respond with a list of peers. You tell the tracker which file you want to download and tracker will respond with the ip address of the user you can download from.
>[INFO] Making request to tracker will add your ip address to the list that can share the file.
### Bencode
Bencode is a data serialization format
### Why torrent switch from HTTP to UDP protocol and what is the difference
HTTP is built on top of another protocol TCP, which must create a persistance connection before sending data from one user to another use which makes it slower then UDP. In case of UDP the data sent is small enough (like 512 bytes), you don't to worry about receiving only part of the data or out of order. It is possible sometime the the sent data will never reach its destination so data need to be re-send or re-requested. For this UDP is good choice for tracker because they send small messages. And we use TCP when we need to send file between peers because those files tend to larger and need to be intact.
### Socket
A socket is an Object through which network communication can happen. In order to send a message through socket it must be buffer not string, or number.
### Connect messaging
Each message is a buffer with a specific format described in the [BEP](http://www.bittorrent.org/beps/bep_0015.html).
The BEP describe the connect request as follows:
| Offset | Size           | Name           | Value         |
|--------|----------------|----------------|---------------|
|0       | 64-bit-integer | connection_id  | 0x41727101980 |
|8       | 32-bit-integer | action         | 0 // connect  |
|12      | 32-bit-integer | transaction_id | ? // random   |
|16      |                |                |               |
- this tells us that our message should start out with 64-bit integer at index 0, and that the value should be 0x417271019180.
Since we just write 8 bytes, the index of the next part is 8. Now wre write 32-bit integer with the value 0. This moves us up to an offset of 12bytes, and we write a random 32-bit integer. So that total message length is 8byte+4byte+4byte=16byte long.
- connection id always should be `0x41727101980` when writing the connection request.
### why to split the connection id into two writes in `buildConnReq` function?
The `Ox` indicates that the number is a hexadecimal number, which can be more convenient representation when working with bytes.
The reason we have to write 4byte chunks, is that there is no method to write 64-bit integer. Actually node.js [doesn't support precise 64-bit integers](https://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin). But writing a 64-bit hexadecimal number as a combination of two 32 bit hexadecimal numbers is easy.
- `writeUInt32BE` writes an unsigned 32-bit integer in big-endian format.
- `big-endian format` this means the most significant byte (the **big end**) is stored first.
Parsing the response is much simpler. Here’s how the response is formatted:

| Offset | Size            | Name            | Value                |
|--------|-----------------|-----------------|----------------------|
| 0      | 32-bit integer  | action          | 0 // connect         |
| 4      | 32-bit integer  | transaction_id  |                      |
| 8      | 64-bit integer  | connection_id   |                      |
| 16     |                 |                 |                      |

### Announce format
| Offset | Size             | Name         | Value                   |
|--------|------------------|--------------|-------------------------|
| 0      | 64-bit integer   | connection_id|                         |
| 8      | 32-bit integer   | action       | 1 // announce           |
| 12     | 32-bit integer   | transaction_id |                       |
| 16     | 20-byte string   | info_hash    |                         |
| 36     | 20-byte string   | peer_id      |                         |
| 56     | 64-bit integer   | downloaded   |                         |
| 64     | 64-bit integer   | left         |                         |
| 72     | 64-bit integer   | uploaded     |                         |
| 80     | 32-bit integer   | event        | 0 // 0: none; 1: completed; 2: started; 3: stopped |
| 84     | 32-bit integer   | IP address   | 0 // default            |
| 88     | 32-bit integer   | key          | ? // random             |
| 92     | 32-bit integer   | num_want     | -1 // default           |
| 96     | 16-bit integer   | port         | ? // should be betwee  |
| 98     |                  |              |                         |

### Parsing the response
| Offset     | Size             | Name           | Value                             |
|------------|------------------|----------------|-----------------------------------|
| 0          | 32-bit integer   | action         | 1 // announce                     |
| 4          | 32-bit integer   | transaction_id |                                   |
| 8          | 32-bit integer   | interval       |                                   |
| 12         | 32-bit integer   | leechers       |                                   |
| 16         | 32-bit integer   | seeders        |                                   |
| 20 + 6 * n | 32-bit integer   | IP address     |                                   |
| 24 + 6 * n | 16-bit integer   | TCP port       |                                   |
| 20 + 6 * N |                  |                |                                   |

It's a bit tricky because the number of addresses that come back isn't fixed. The addresses come in group of 6 bytes, the first 4 represent the IP address and the next 2 represent the port. So our code will need to correctly break up the address part of the response.
