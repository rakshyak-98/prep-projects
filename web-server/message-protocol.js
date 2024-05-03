/**
 * @param {{data: Buffer, length: number}} buf
*/
function cutMessage(buf){
    const idx = buf.data.subarray(0, buf.length).indexOf("\n");
    if(idx < 0){
        return null;
    }
    const msg = Buffer.from(buf.data.subarray(0, idx+1));
    bufPop(buf, idx + 1);
    return msg;
}

/**
 * @param {{data: Buffer, length: number}} buf
 * @param {number} len
*/
function bufPop(buf, len){
    buf.data.copyWithin(0, len, buf.length);
    buf.length -= len;
}


module.exports = {
    cutMessage,
}
