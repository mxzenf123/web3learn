// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

import "./IBank.sol";

contract Bank is IBank{
    // 部署合约所有者即管理员
    address  public owner;
    // 用户存款记录
    mapping(address => uint) public accounts;
    // 存储金额最多的三个用户
    address[] public addresses; 

    
    constructor(){
        owner = msg.sender;
    }

    event notExistsFunc(string);

    fallback() external payable{
        emit notExistsFunc('called not exists function');
    }

    // 接收转账
    receive() virtual external payable{
        accounts[msg.sender] += msg.value;
        // 多次转账取最新转账总金额
        uint _balance = accounts[msg.sender];
        
        if (addresses.length == 0){
            addresses.push(msg.sender);
        } else {
            for (uint i = addresses.length-1; i >= 0; i--) {
                // 转账账户已经在前三数组中后直接返回
                if (msg.sender == addresses[i]){
                    break;
                } 
                // 转账账户不在前三数组中
                if (0==i){
                    // addresses只保存账户金额前三的address且金额排序由小到大依次保存在数组中
                    if (addresses.length<3) {
                        // 小于3直接push进数组
                        addresses.push(msg.sender);
                        // 如果只有2个比较大小如果第一个金额比第二个大交换位置
                        if (addresses.length == 2){
                            if (accounts[addresses[0]] > accounts[addresses[1]]){
                                address _a   = addresses[0];
                                addresses[0] = addresses[1];
                                addresses[1] = _a;
                            }
                        } else if (addresses.length == 3) {
                            // 如果第三个比第二个金额大直接返回，即第三个金额最大
                            if (msg.value >= accounts[addresses[1]]){
                                return;
                            }
                            // 比第一个大第三个小，放[1]下标，和第二个交换位置
                            if (msg.value >= accounts[addresses[0]] && msg.value < accounts[addresses[2]]){
                                address _a   = addresses[2];
                                addresses[2] = addresses[1];
                                addresses[1] = _a;
                            } else {
                                // 最小放第一个位置[0]，先和[1]交换位置再和[0]交换位置
                                address _a   = addresses[2];
                                addresses[2] = addresses[1];
                                addresses[1] = _a;
                                _a           = addresses[0];
                                addresses[0] = addresses[1];
                                addresses[1] = _a;
                            }
                        }
                    } else {
                        // 新转账的比最小的[0]还小那么直接返回
                        if (accounts[addresses[0]] > _balance){
                            return;
                        }
                        // 比第一个[0]大第二个[1]小，直接替换第一个[0]
                        if (accounts[addresses[0]] < _balance && accounts[addresses[1]] >= _balance){
                            addresses[0] = msg.sender;
                            return;
                        }
                        // 不论哪种情况[0]最小的都要被覆盖
                        addresses[0] = addresses[1];
                        // 比第二个[1]大但比第三个[2]小，[1]替换[0]，展位[1]
                        if (accounts[addresses[1]] < _balance && accounts[addresses[2]] >= _balance){
                            addresses[1] = msg.sender;
                        }
                        // 比最大的还大，[1]占位[0]，[2]占位[1]
                        if (accounts[addresses[2]] < _balance){
                            addresses[1] = addresses[2];
                            addresses[2] = msg.sender;
                        }
                    }
                    
                }
            }
            
        }
        
    }
 
    // 管理员提取资金
    function withdraw(address payable _to) external {
        require(_to == owner,"not owner");
        _to.transfer(address(this).balance);
    }
    // 获取合约余额
    function getBalanceOfContract() view external returns(uint){
        return address(this).balance;
    }
}