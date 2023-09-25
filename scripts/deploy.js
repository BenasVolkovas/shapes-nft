const hre = require("hardhat");

async function main() {
    const ShapesNFT = await hre.ethers.getContractFactory("ShapesNFT");
    const shapesnft = await ShapesNFT.deploy(
        "Qmcci3yLQArnn4MjZr5vtF56ZJgz3pKDtLE1b5cXEQHeoo"
    );

    await shapesnft.deployed();
    console.log("ShapesNFT deployed to:", shapesnft.address);

    const newTokenId = await shapesnft.payToMint({
        value: ethers.utils.parseEther("0.05"),
    });

    await newTokenId.wait();
    console.log("Token id: ", newTokenId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
