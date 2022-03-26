import { useState } from "react";
import { ethers } from "ethers";

function WalletBalance() {
    const [balance, setBalance] = useState();

    const getBalance = async () => {
        const [account] = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };

    return (
        <div className="mt-5 mb-5">
            <h5 className="card-title">Your ETH Balance: {balance}</h5>
            <button className="btn btn-success" onClick={() => getBalance()}>
                Show My Balance
            </button>
        </div>
    );
}

export default WalletBalance;
