import WalletBalance from "./WalletBalance";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ShapesNFT from "../artifacts/contracts/ShapesNFT.sol/ShapesNFT.json";
import LinkedinLogo from "../assets/linkedin.svg";

const CONTRACT_ADDRESS = "0x5c3690588875119b5B7747446135AdE8456A35eB";
const LINKEDIN_LINK = "https://www.linkedin.com/in/benas-volkovas/";
const OPENSEA_LINK = "https://testnets.opensea.io/collection/shapesnft-1";
const TOTAL_MINT_COUNT = 50;
const GOERLI_CHAIN_ID = "0x5";

const Home = () => {
    const [totalMinted, setTotalMinted] = useState(0);
    const [isMinting, setIsMinting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [providerContract, setProviderContract] = useState(null);
    const [signerContract, setSignerContract] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            isWalletConnected();
        } else {
            alert("Please install MetaMask!");
        }
    }, []);

    useEffect(() => {
        if (providerContract) {
            getCount();
        }
    }, [providerContract]);

    useEffect(() => {
        if (provider) {
            setProviderContract(
                new ethers.Contract(CONTRACT_ADDRESS, ShapesNFT.abi, provider)
            );
        }
    }, [provider]);

    useEffect(() => {
        if (signer) {
            setSignerContract(
                new ethers.Contract(
                    CONTRACT_ADDRESS,
                    ShapesNFT.abi,
                    signer
                ).connect(signer)
            );

            isCorrectNetwork();
        }
    }, [signer]);

    const isWalletConnected = async () => {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length !== 0) {
            setSigner(tempProvider.getSigner());
            setIsConnected(true);
        }
    };

    const isCorrectNetwork = async () => {
        let chainId = await window.ethereum.request({
            method: "eth_chainId",
        });

        if (chainId !== GOERLI_CHAIN_ID) {
            alert("You are not connected to the Goerli Testnet!");
        }
    };

    const connectWallet = async () => {
        if (!isConnected) {
            await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setSigner(provider.getSigner());
            setIsConnected(true);
        }
    };

    const getCount = async () => {
        try {
            const count = await providerContract.count();
            setTotalMinted(count.toNumber());
        } catch (e) {
            alert("Error getting total minted count");
        }
    };

    const mintToken = async () => {
        try {
            setIsMinting(true);

            const result = await signerContract.payToMint({
                value: ethers.utils.parseEther("0.05"),
            });
            await result.wait();

            setIsMinting(false);

            alert(
                `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${totalMinted}`
            );
            getCount();
        } catch (e) {
            alert("Error minting NFT");
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
            <div>
                <p className="fw-bold title" style={{ fontSize: "60px" }}>
                    ShapesNFT Collection
                </p>
                <p className="fs-3 fw-bold">
                    Each unique. Each beautiful. Discover your NFT today.
                </p>
                <p className="fs-6">
                    Choose Goerli testnet and make sure you have 0.05 ETH
                </p>
                {totalMinted ? (
                    <p className="fs-5">
                        {`${totalMinted}/${TOTAL_MINT_COUNT} NFTs minted so far`}
                    </p>
                ) : (
                    <></>
                )}
                <div>
                    <WalletBalance />

                    <button
                        className="btn btn-primary me-3"
                        onClick={viewNFTCollection}
                    >
                        🌊 View Collection on OpenSea
                    </button>
                    {!isConnected ? (
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
            {isMinting && (
                <div>
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Minting... please wait</p>
                </div>
            )}
            <div>
                <a
                    href={LINKEDIN_LINK}
                    className="text-light"
                    target="_blank"
                    rel="noreferrer"
                >
                    Created by Benas
                </a>
            </div>
        </div>
    );
};

export default Home;
