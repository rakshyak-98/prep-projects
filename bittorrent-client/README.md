## Overview of bittorrent
- you need to send a request to something called **tracker**, and tracker will respond with a list of peers. You tell the tracker which file you want to download and tracker will respond with the ip address of the user you can download from.
>[INFO] Making request to tracker will add your ip address to the list that can share the file.
### Bencode
Bencode is a data serialization format
### Why torrent switch from HTTP to UDP protocol and what is the difference
HTTP is built on top of another protocol TCP, which must create a persistance connection before sending data from one user to another use which makes it slower then UDP. In case of UDP the data sent is small enough (like 512 bytes), you don't to worry about receiving only part of the data or out of order. It is possible sometime the the sent data will never reach its destination so data need to be re-send or re-requested. For this UDP is good choice for tracker because they send small messages. And we use TCP when we need to send file between peers because those files tend to larger and need to be intact.
### Socket
A socket is an Object through which network communication can happen. In order to send a message through socket it must be buffer not string, or number.
