const crypto    = require('crypto');

// 区块类
class Block{
    #data;
    #timestamp;
    constructor(data, hash, previous_hash){
        this.#data         = data;// 打包的交易数据
        this.#timestamp    = new Date().getTime();// 时间戳
        this.hash          = hash; // 当前区块hash
        this.previous_hash = previous_hash //上一个区块的hash值
    }
}

// 区块链 链表节点数据结构
class BlockNode{
    constructor(block, next, pre){
        this.block = block; // 区块节点
        this.next  = next;  // 下一个区块 
        this.pre   = pre;   // 上一个区块
    }
}

class YangxinChain{
    #difficulty;
    #block0;// 创世区块
    #cur_block;// 当前区块
    constructor(difficulty){
        this.#difficulty = difficulty;// 挖矿难度，只有当hash数字指纹 以difficulty个0开头
        this.#block0     = new BlockNode(new Block('我是创世区块','0000','0000'), null, null);
        this.#cur_block  = this.#block0; //初始化设置当前区块为创世区块
    }

    set(difficulty){
        if (0 >= difficulty){
            throw new Error("难度必须大于0")
        }
        this.#difficulty = difficulty;//修改难度
    }

    // 根据data也就是交易数据和随机数计算hash值
    calculateHash(data, nonce){
        

        while(true){
            let _timestamp    = new Date().getTime();
            let _data         = data + (++nonce).toString() + _timestamp.toString();
            // 创建一个 SHA-256 哈希对象
            const hash = crypto.createHash('sha256');
            // 更新哈希对象，传入数据
            hash.update(_data); // 通常会包含一个盐值或秘钥
            // 生成十六进制格式的哈希值
            const hexHash = hash.digest('hex');
            if(hexHash.startsWith('0'.repeat(this.#difficulty))){
              return hexHash;
            }
        }
    }

    // 添加区块
    addBlock(data, hash){
        let _block           = new Block(data, hash, this.#cur_block.hash);
        let _blockNode       = new BlockNode(_block, null, this.#cur_block);
        this.#cur_block.next = _blockNode;
        this.#cur_block      = _blockNode;
    }
    // 挖矿
    mineBlock(data){
        let _hash = this.calculateHash(data, 0);
        this.addBlock(data, _hash);
    }
    // 打印区块链
    print(){
        // 先打印创世区块
        console.log(this.#block0.block.hash)
        // 从创世区块一个一个开始打印链表的hash之
        let _curBlock = this.#block0;
        while(_curBlock.next){
            _curBlock = _curBlock.next;
            console.log('->'+_curBlock.block.hash);
        }
    }
}

// 执行入口函数
function main(){
    let yangxinChain = new YangxinChain(4);
    // 0，挖矿前输出区块链以便后续查看挖矿结果
    yangxinChain.print();
    let data = {
        'timestamp': 1506057125,
        'transactions': [
    { 'sender': "1", 
    'recipient': "2", 
    'amount': 5, } ]
    };
    // 1, 创建难度为4的区块链
    // 只实现了简单的串行单矿工挖矿情况
    yangxinChain.mineBlock(JSON.stringify(data));
    // 2，第一次挖矿
    data = {
        'timestamp': 1506057125,
        'transactions': [
    { 'sender': "4", 
    'recipient': "5", 
    'amount': 5, } ]
    };
    yangxinChain.mineBlock(JSON.stringify(data));
    // 3, 第二次挖矿
    data = {
        'timestamp': 1506057125,
        'transactions': [
    { 'sender': "4111", 
    'recipient': "533", 
    'amount': 5, } ]
    };
    yangxinChain.mineBlock(JSON.stringify(data));
    // 4，第三次挖矿
    data = {
        'timestamp': 1506057125,
        'transactions': [
    { 'sender': "4333", 
    'recipient': "598", 
    'amount': 5, } ]
    };
    yangxinChain.mineBlock(JSON.stringify(data));

    // 5，挖矿后再输出区块链数据
    yangxinChain.print();
    /*
    挖矿后区块链数据：
    0000 创世区块
    ->000011de2b6ffbb2d284a8dd15a9d110d49994b80b762ff62a646beed72e453a 第一次挖矿区块hash
    ->000076ac38d532d7d02de19d4e6937678750b382b410e1f476cd2a9d75daf167 第二次挖矿区块hash
    ->0000137893c7e279ad9ba785f2903e784874958db09bb20ed3e2025ceee71389 第三次挖矿区块hash
    ->0000da659da5b6479e82904822e0b40882aa0686c9e9308526ca5216a8880076 第四次挖矿区块hash

    */
}
// 执行
main();