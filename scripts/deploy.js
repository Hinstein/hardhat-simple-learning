const { keccak256 } = require("ethers")
const { ethers, run, network } = require("hardhat")
const { etherscan } = require("../hardhat.config")

async function main() {
    const deployedContract = await ethers.deployContract("SimpleStorage")
    console.log("Deploying contract ...")
    const contract = await deployedContract.waitForDeployment()
    const contractAddress = await contract.getAddress()
    console.log("SimpleStorage Contract Address:", contractAddress)

    if (network.config.chainId === 11155111 && process.env.ETHERSACN_API_KEY) {
        await deployedContract.deploymentTransaction().wait(7)
        await verify(contractAddress, [])
    }
    const currenValue = await deployedContract.retrieve()
    console.log("Current Value is ", currenValue)

    const transactionResponse = await deployedContract.store(7)
    await transactionResponse.wait(1)

    const updatedValue = await deployedContract.retrieve()
    console.log("Updated Value is ", updatedValue)
}
async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
