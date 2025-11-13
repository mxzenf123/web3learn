// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

import "./Bank.sol";

contract BigBank is Bank{

   constructor(){
        owner = msg.sender;
   }

   // 检查最小转账金额
   modifier checkMin() {
        require(msg.value >= 1000000000000000, "The transfer amount is below the minimum required");
        _;
    }
   
   receive() override  external payable checkMin{

       
   }

   // 调用其他合约将金额转入管理账户
   function adminWithdraw(address _ads) external {
      (bool success, ) = payable(_ads).call(abi.encodeWithSignature("withdraw(address)", owner));
      require(success, "Call failed");    
   }
}