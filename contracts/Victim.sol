// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Victim {
    // storage：账户-> 余额
    mapping(address => uint256) public balanceOf;

    // 1.存款函数
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balanceOf[msg.sender] += msg.value;
    } 

    // 2.取款函数
    function withdraw() external {
        require(balanceOf[msg.sender] > 0, "Insufficient balance");    //消息发送者的账户余额大于0

        // call后内容为空，会触发receive/fallback函数，造成重入攻击
        (bool success, ) = msg.sender.call{value: balanceOf[msg.sender]}("");
        require(success, "Transfer failed!");

        balanceOf[msg.sender] = 0;   // 余额更新在call之外，造成多次提款
    }

    // 3.查看合约的余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}