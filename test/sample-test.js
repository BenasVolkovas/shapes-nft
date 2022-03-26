const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShapesNFT", function () {
    it("Should mint and transfer an NFT to someone", async function () {
        const ShapesNFT = await ethers.getContractFactory("ShapesNFT");
        const shapesnft = await ShapesNFT.deploy(
            "Qmcci3yLQArnn4MjZr5vtF56ZJgz3pKDtLE1b5cXEQHeoo"
        );
        await shapesnft.deployed();

        const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

        let balance = await shapesnft.balanceOf(recipient);
        expect(balance).of.equal(0);

        const newlyMintedToken = await shapesnft.payToMint({
            from: recipient,
            value: ethers.utils.parseEther("0.05"),
        });
        await newlyMintedToken.wait();

        balance = await shapesnft.balanceOf(recipient);
        expect(balance).to.equal(1);
    });
});
