const hre = require("hardhat");

async function main() {
    const [deployer, attacker] = await hre.ethers.getSigners();

    console.log(`Deploying contracts with the deployer account: ${deployer.address}`);

    // Victim  SC
    const Victim = await hre.ethers.getContractFactory("Victim");
    const victim = await Victim.deploy();
    await victim.waitForDeployment();
    console.log(`Victim deployed at: ${await victim.getAddress()}`);

    // Attack SC
    const Attack = await hre.ethers.getContractFactory("Attack");
    // 部署 Attack 合约，并将 Bank 合约的地址作为参数传递
    const attack = await Attack.deploy(await victim.getAddress());
    await attack.waitForDeployment();
    console.log(`Attack deployed at: ${await attack.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});