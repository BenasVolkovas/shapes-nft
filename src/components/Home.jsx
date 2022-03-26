import WalletBalance from "./WalletBalance";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ShapesNFT from "../artifacts/contracts/ShapesNFT.sol/ShapesNFT.json";
import LinkedinLogo from "../assets/linkedin.svg";

const CONTRACT_ADDRESS = "0x9B75Acfa4caceDF41AC968EC2C2d45377c3cD3c2";
const LINKEDIN_LINK = "https://www.linkedin.com/in/benas-volkovas/";
const OPENSEA_LINK =
    "https://testnets.opensea.io/collection/shapesnft-k5hsyg1bwb";
const TOTAL_MINT_COUNT = 50;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const connectedContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ShapesNFT.abi,
    signer
);

const Home = () => {
    const [totalMinted, setTotalMinted] = useState(0);
    const [isMining, setIsMining] = useState(false);
    const [userAccount, setUserAccount] = useState("");

    useEffect(() => {
        getCount();
        checkIfWalletIsConnected();
    }, []);

    const checkIfWalletIsConnected = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length !== 0) {
            checkCurrentChainId();
            setUserAccount(accounts[0]);

            setupEventListener();
        }
    };

    const connectWallet = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setUserAccount(accounts[0]);
        setupEventListener();
    };

    const getCount = async () => {
        try {
            const count = await connectedContract.count();
            setTotalMinted(parseInt(count.toNumber()));
        } catch (e) {
            console.log(e);
        }
    };

    const checkCurrentChainId = async () => {
        let chainId = await window.ethereum.request({ method: "eth_chainId" });

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
            alert("You are not connected to the Rinkeby Test Network!");
        }
    };

    const setupEventListener = async () => {
        try {
            connectedContract.on("NewNFTMinted", (from, tokenId) => {
                console.log(from, tokenId.toNumber());
                alert(
                    `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
                );
            });
        } catch (e) {
            console.log(e);
        }
    };

    const mintToken = async () => {
        try {
            const result = await connectedContract.payToMint({
                from: userAccount,
                value: ethers.utils.parseEther("0.05"),
            });
            console.log(result);
            setIsMining(true);

            await result.wait();
            setIsMining(false);

            getCount();
        } catch (e) {
            console.log(e);
        }
    };

    const viewNFTCollection = () => {
        window.open(OPENSEA_LINK, "_blank");
    };

    return (
        <div
            className="text-center p-5"
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* <WalletBalance /> */}

            <div>
                <p className="fw-bold title" style={{ fontSize: "60px" }}>
                    My NFT Collection
                </p>
                <p className="fs-2 fw-bold">
                    Each unique. Each beautiful. Discover your NFT today.
                </p>
                {totalMinted && (
                    <p className="fs-3">
                        {`${totalMinted}/${TOTAL_MINT_COUNT} NFTs minted so far`}
                    </p>
                )}
                <div>
                    <WalletBalance />

                    <button
                        className="btn btn-primary me-3"
                        onClick={viewNFTCollection}
                    >
                        🌊 View Collection on OpenSea
                    </button>
                    {userAccount === "" ? (
                        <button
                            className="btn btn-light"
                            onClick={connectWallet}
                        >
                            💰 Connect to Wallet
                        </button>
                    ) : (
                        <button className="btn btn-light" onClick={mintToken}>
                            Mint NFT
                        </button>
                    )}
                </div>
            </div>
            {isMining && (
                <div>
                    <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Mining... please wait</p>
                </div>
            )}
            <div>
                <img
                    className="me-2"
                    alt="Linkedin Logo"
                    src={LinkedinLogo}
                    width="30"
                />
                <a href={LINKEDIN_LINK} target="_blank" rel="noreferrer">
                    Connect with me via Linkedin
                </a>
            </div>
        </div>
    );
};

export default Home;
