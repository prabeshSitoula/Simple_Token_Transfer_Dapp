"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContractAddress from "@/contracts/contract-address.json";
import abi from "@/contracts/SimpleToken.json";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from "./components/Card";

interface StateType {
  provider: ethers.BrowserProvider | null;
  signer: any | null;
  contract: ethers.Contract | null;
}

const simpleTokenContractAddress = ContractAddress.SimpleToken;
const contractABI = abi.abi;
// const SEPOLIA_NETWORK_ID = "11155111";
const HARDHAT_NETWORK_ID = "31337";

export default function Home() {
  const [state, setState] = useState<StateType>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [accounts, setAccounts] = useState("None");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          if (ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            // if (ethereum.networkVersion === SEPOLIA_NETWORK_ID) {
            const account = await ethereum.request({
              method: "eth_requestAccounts",
            });

            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              simpleTokenContractAddress,
              contractABI,
              signer
            );
            setAccounts(account);
            setUserAddress(account[0]);
            setState({ provider, signer, contract });
          } else {
            setUserAddress("Other Network");
          }
        } else {
          alert("Please install Metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

  const handleTransfer = async () => {
    if (!recipient || !amount)
      return alert("Please enter recipient and amount");
    if (!userAddress) return alert("You cannot perform this operation");
    if (userAddress === "Other Network")
      return alert("Please switch to the Sepolia Network");

    try {
      await state.contract!.transfer(recipient, ethers.parseUnits(amount, 18));
    } catch (error) {
      console.error("Error performing transfer:", error);
    }
  };

  const handleGetBalance = async () => {
    if (!userAddress) return alert("You cannot perform this operation");
    if (userAddress === "Other Network")
      return alert("Please switch to the Sepolia Network");

    const response = await state.contract!.balances(userAddress);
    setBalance(ethers.formatUnits(response, 18));
  };

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center space-x-8">
        <Card
          imageSrc="/token-transfer-left.png"
          altText="Token Transfer Left"
        />
        <div className="bg-white p-12 rounded-lg shadow-lg w-1/3">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
            SimpleToken DApp
          </h2>
          <h3 className="text-lg font-semibold mb-8 text-center text-gray-600">
            Your Address: {accounts[0]}
          </h3>
          <input
            type="text"
            className="w-full p-4 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="number"
            className="w-full p-4 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={() => handleTransfer()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow w-full hover:bg-blue-600 transition duration-300"
          >
            Transfer Tokens
          </button>
          <button
            onClick={() => handleGetBalance()}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow w-full mt-6 hover:bg-purple-600 transition duration-300"
          >
            Get Balance
          </button>
          {balance && (
            <div className="text-center text-2xl font-bold mt-6 text-gray-800">
              Balance: {balance} Tokens
            </div>
          )}
        </div>
        <Card
          imageSrc="/token-transfer-right.png"
          altText="Token Transfer Right"
        />
      </div>
      <Footer />
    </div>
  );