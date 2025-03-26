# 重入攻击示例

这个项目演示了如何在以太坊智能合约中进行 **重入攻击**。重入攻击发生在一个合约调用另一个合约时，第二个合约在第一次调用还未完成时再次调用第一个合约，从而导致意外的行为，如合约余额被恶意提空。

## 项目概述

本项目包含两个合约：

- **Victim 合约**：一个简单的合约，允许用户存款和提取 Ether。
- **Attack 合约**：一个恶意合约，利用 **Victim 合约** 中的重入漏洞进行攻击。

### 重入攻击流程：

1. **Victim 合约** 允许用户存款和提取 Ether。在提取时，合约会先转账 Ether，再更新余额。
2. **Attack 合约** 利用这一漏洞，通过重入调用 **Victim 合约** 的 `withdraw()` 函数，从而多次提取余额。

## 安装和使用

### 1. 安装依赖

确保你的机器上已安装 [Node.js](https://nodejs.org/)，然后执行以下命令安装项目依赖：

```bash
git clone https://github.com/KISSInori/Web3Attack_Hardhat.git
cd Web3Attack_Hardhat/reentrancy
npm install
```

### 2. 部署合约
使用 Hardhat 编译并部署 Victim 合约 和 Attack 合约：
```bash
npx hardhat compile  

npx hardhat run scripts/deploy.js --network hardhat
```

### 3.执行攻击
测试脚本将：

（1）向 Victim 合约 存入 10 个 Ether。

（2）调用 Attack 合约 的 attack() 函数发动重入攻击。

（3）将 Victim 合约 的 Ether 提空。

（4）检查 Attack 合约 的余额，确保攻击成功。

使用测试脚本执行重入攻击测试：
```bash
npx hardhat test
```