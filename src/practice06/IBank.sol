// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

interface IBank{
    function withdraw(address payable _to) external;
    function getBalanceOfContract() view external returns(uint);
}