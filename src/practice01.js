const crypto = require('crypto');
const nickname = 'yangxin';

let nonce  = 0;
const timerName = 'hashSearched';
console.time(timerName);
while(true){
    let data = nickname + (++nonce).toString();
    // 创建一个 SHA-256 哈希对象
    const hash = crypto.createHash('sha256');
    // 更新哈希对象，传入数据
    hash.update(data); // 通常会包含一个盐值或秘钥
    // 生成十六进制格式的哈希值
    const hexHash = hash.digest('hex');
    if(hexHash.startsWith('0000')){
        console.timeEnd(timerName);
        console.log(`SHA-256 摘要 (十六进制): ${hexHash}`);
        break;
    }
    
}