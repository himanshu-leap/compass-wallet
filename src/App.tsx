import './App.css'
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useDisconnect} from "wagmi";
import {Contract, ethers, MaxUint256} from "ethers";
import {erc20Abi} from "viem";

const App = () => {
    const {isConnected} = useAccount();
    const {disconnect} = useDisconnect();

    const sign = async () => {
        console.log(MaxUint256)
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();

        const accounts = await provider.send('eth_requestAccounts', []);
        console.log("Your accounts", accounts);

        // 0x57eE725BEeB991c70c53f9642f36755EC6eb2139 - WSEI
        // 0x9e7A8e558Ce582511f4104465a886b7bEfBC146b - JLY
        const contract = new Contract("0x57eE725BEeB991c70c53f9642f36755EC6eb2139", erc20Abi, signer);
        console.log("ERC20 Contract", contract)

        // 0x7ccBebeb88696f9c8b061f1112Bb970158e29cA5 Wailt contractgit
        const tx = await contract.approve("0x7ccBebeb88696f9c8b061f1112Bb970158e29cA5", MaxUint256);
        console.log("Transaction", tx);
        tx.wait();
    }

    return (
        <>
            <ConnectButton/>

            {isConnected && (
                <button onClick={() => disconnect()}>Disconnect</button>
            )}

            {isConnected && (<div>
                <button onClick={() => sign()}>Sign transaction</button>
            </div>)}

        </>
    )
}

export default App
