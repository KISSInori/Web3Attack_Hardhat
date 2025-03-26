const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Attack", function () {
    let Victim, Attack;
    let victim, attack;
    let deployer, attacker;

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        // 部署 Victim 合约
        Victim = await ethers.getContractFactory("Victim");
        victim = await Victim.deploy();
        await victim.waitForDeployment();  
        const victimAddress = await victim.getAddress();  

        // Deployer 存入 10 ETH
        await victim.connect(deployer).deposit({ value: ethers.parseEther("10") });

        // 部署 Attack 合约
        Attack = await ethers.getContractFactory("Attack");
        attack = await Attack.connect(attacker).deploy(victimAddress);
        await attack.waitForDeployment();
    });

    it("Should allow the attacker to drain funds via reentrancy", async function () {
        console.log("Victim initial balance:", ethers.formatEther(await victim.getBalance()));
        console.log("Attack initial balance:", ethers.formatEther(await attack.getBalance()));

        // 攻击者调用 attack()，发送 1 ETH
        await attack.connect(attacker).attack({ value: ethers.parseEther("1") });

        // 检查余额
        const victimFinalBalance = ethers.formatEther(await victim.getBalance());
        const attackFinalBalance = ethers.formatEther(await ethers.provider.getBalance(attack.getAddress()));

        console.log("Victim final balance:", victimFinalBalance);
        console.log("Attacker final balance:", attackFinalBalance);

        // 受害者余额应为 0
        expect(await victim.getBalance()).to.equal(0);
        // 攻击者余额应大于 10 ETH（成功窃取）
        expect(await ethers.provider.getBalance(attack.getAddress())).to.be.gt(ethers.parseEther("10"));
    });
});
