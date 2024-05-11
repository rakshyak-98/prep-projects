# echo-sever

## Why to pause on read and resume after read complete
The server is both a producer and a consumer, as is the client. If the client produces data faster then client consumes the encoded data (or the client does not consume and data at all), the server's memory will grow indefinitely if the server does not wait for writes to complete.

## how does a outer identifier have access of `resolve` and `rejects` function of `Promise`
What I did is create a `conn` identifier and assigned reference of the `resolve` and `reject` functions. So doing this I can call those functions with help of `conn`. But you can do it only once per conn object creation so I put it it in `soInit` when a new connection event occurs.

## Why `soRead` have a check for `conn.ended`
It is because a client can end it connection in between stream, when the server is reading it.

