const { deployContract } = require("@nomicfoundation/hardhat-ethers/types")
const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", () => {
    let deployedContract
    beforeEach(async function () {
        deployedContract = await ethers.deployContract("SimpleStorage")
        await deployedContract.waitForDeployment()
    })

    it("Should start with a favorite number of 0", async function () {
        const currenValue = await deployedContract.retrieve()
        const expectedValue = "0"
        assert.equal(currenValue.toString(), expectedValue)
    })

    it("Should updated when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await deployedContract.store(expectedValue)
        await transactionResponse.wait(1)
        const currenValue = await deployedContract.retrieve()
        assert.equal(currenValue.toString(), expectedValue)
    })
})
