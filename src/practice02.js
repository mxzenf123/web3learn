const NodeRSA = require('node-rsa');
const { generateKeyPairSync, publicEncrypt, privateDecrypt } = require('crypto');

let key = new NodeRSA({ b: 1024 });
key.setOptions({ encryptionScheme:'pkcs1'});
    
let pubkey = key.exportKey('public') //生成公钥，发给前端用于数据加密
let privkey = key.exportKey('private')//生成私钥，用于数据解密


// 昵称
const nickname = 'yangxin';
let nonce  = 1;

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// 加密
// 需要加密的数据
const data = nickname + nonce.toString();
const pub = publicKey.toString('ascii');
// 公钥加密过程
const encryptData = publicEncrypt(pub, Buffer.from(data)).toString('base64');
console.log('加密后数据:', encryptData);
/*
加密后数据: ZOOZhBQmlf7qazJ/BEZt4lbYBnnlpZuatyCa1YcescyEbd9dW57CC5KS7yK3OhLYadc6abAP+E6YA5quxFHKKoEzEL+lod17vtHvgx8oBRo43kr901E6qIuWBaZbxVhMxYPZCPt1zyLSFzHFclC622Pfrjc0c4VjqL4i3vGFLEk=
*/
// 解密
const pri = privateKey.toString('ascii')
// 私钥解密
const decryptData = privateDecrypt(pri, Buffer.from(encryptData.toString('base64'), 'base64'));
console.log('解密后数据:', decryptData.toString());//解密后数据: yangxin1
