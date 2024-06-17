"use client";
import { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import {
  ConnectedStarknetWindowObject,
  connect,
  disconnect,
} from "starknetkit";
import CONTRACT_ABI from "../abis/abi.json";
import { useStringFromByteArray } from "@/hooks";
const CONTRACT_ADDRESS =
  "0x397ec7675fe9448acbdd00c5c5dc9b37d242ec5499aa8c43f850281a2d33355";

export default function Home() {
  const [address, setAddress] = useState("");
  const [connection, setConnection] = useState<
    ConnectedStarknetWindowObject | undefined
  >(undefined);
  const [provider, setProvider] = useState<RpcProvider | undefined>(undefined);
  const [account, setAccount] = useState(undefined);

  const [formData, setFormData] = useState({
    balanceAccount: "",
    approveSpender: "",
    approveAmount: "",
    allowanceOwner: "",
    allowanceSender: "",
    transferFromSender: "",
    transferFromRecipient: "",
    transferFromAmount: "",
    transferRecipient: "",
    transferAmount: "",
  });

  const [formResults, setFormResults] = useState({
    balanceResult: "",
    nameResult: "",
    symbolResult: "",
    decimalResult: 0,
    supplyResult: "",
    allowanceResult: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const conn = await connect({
          webWalletUrl: "https://www.argent.xyz/",
          modalMode: "neverAsk",
        });

        if (conn) {
          const { wallet } = conn;
          if (wallet && wallet.isConnected) {
            setConnection(wallet);
            setAddress(wallet.selectedAddress);
            setAccount(wallet.account);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();

    const providerInfuraTestnet = new RpcProvider({
      nodeUrl:
        "https://starknet-sepolia.infura.io/v3/" +
        process.env.NEXT_PUBLIC_INFURA_KEY,
    });

    setProvider(providerInfuraTestnet);
  }, []);

  const connectWallet = async () => {
    try {
      const conn = await connect({
        webWalletUrl: "https://www.argent.xyz/",
      });

      if (conn) {
        const { wallet } = conn;
        if (wallet && wallet.isConnected) {
          setConnection(wallet);
          setAddress(wallet.selectedAddress);
          setAccount(wallet.account);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setAddress("");
      setConnection(undefined);
      setAccount(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const getName = async () => {
    if (provider) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
      try {
        const res = await contract.name();

        if (res) {
          const value = useStringFromByteArray({ byteArray: res });
          setFormResults({
            ...formResults,
            nameResult: value,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getSymbol = async () => {
    if (provider) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
      try {
        const res = await contract.symbol();

        if (res) {
          const value = useStringFromByteArray({ byteArray: res });
          console.log(res);

          setFormResults({
            ...formResults,
            symbolResult: value,
          });
          console.log(value);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getDecimal = async () => {
    if (provider) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
      try {
        const res = await contract.decimals();
        const numberValue = Number(res);
        setFormResults({
          ...formResults,
          decimalResult: numberValue,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getTotalSupply = async () => {
    if (provider) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
      try {
        const res = await contract.total_supply();
        const value = res.toString();
        setFormResults({
          ...formResults,
          supplyResult: value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getBalance = async () => {
    if (provider) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
      try {
        const res = await contract.balanceOf(formData.balanceAccount);
        const value = res.toString();
        setFormResults({
          ...formResults,
          balanceResult: value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const approveSpender = async () => {
    if (account) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      try {
        const state = await contract.approve(
          formData.approveSpender,
          formData.approveAmount
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAllowance = async () => {
    if (provider) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
      try {
        const res = await contract.allowance(
          formData.allowanceOwner,
          formData.allowanceSender
        );
        const value = res.toString();
        setFormResults({
          ...formResults,
          allowanceResult: value,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const transferFromAnotherAccount = async () => {
    if (account) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      try {
        const state = await contract.transferFrom(
          formData.transferFromSender,
          formData.transferFromRecipient,
          formData.transferFromAmount
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const transfer = async () => {
    if (account) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      try {
        const state = await contract.transfer(
          formData.transferRecipient,
          formData.transferAmount
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <main>
      <header className="flex items-center justify-between h-[60px] px-10 border-solid border-b-2 border-black">
        <p>{address}</p>
        {connection ? (
          <button onClick={disconnectWallet}>Disconnect</button>
        ) : (
          <button onClick={connectWallet}>Connect</button>
        )}
      </header>

      <section className="p-24 flex flex-col gap-10">
        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Total supply</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <button
                    onClick={getTotalSupply}
                    className="text-start button"
                  >
                    Query
                  </button>
                  <p>{formResults.supplyResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Decimal</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <button onClick={getDecimal} className="text-start button">
                    Query
                  </button>
                  <p>{formResults.decimalResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Symbol</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <button onClick={getSymbol} className="text-start button">
                    Query
                  </button>
                  <p>{formResults.symbolResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Name</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <button onClick={getName} className="text-start button">
                    Query
                  </button>
                  <p>{formResults.nameResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Balance</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <input
                  name="balanceAccount"
                  onChange={handleInputChange}
                  type="text"
                  placeholder="account"
                  className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                />
                <div className="flex flex-col gap-8">
                  <button onClick={getBalance} className="text-start button">
                    Query
                  </button>
                  <p>{formResults.balanceResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Approve</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <input
                    onChange={handleInputChange}
                    type="text"
                    name="approveSpender"
                    placeholder="spender"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                  <input
                    onChange={handleInputChange}
                    type="text"
                    name="approveAmount"
                    placeholder="amount"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                </div>
                <button onClick={approveSpender} className="text-start button">
                  Transact
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Allowance</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <input
                    onChange={handleInputChange}
                    type="text"
                    name="allowanceOwner"
                    placeholder="owner"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                  <input
                    onChange={handleInputChange}
                    type="text"
                    name="allowanceSender"
                    placeholder="sender"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                </div>
                <div className="flex flex-col gap-8">
                  <button onClick={getAllowance} className="text-start button">
                    Query
                  </button>
                  <p>{formResults.allowanceResult}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Transfer from</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <input
                    onChange={handleInputChange}
                    type="text"
                    placeholder="sender"
                    name="transferFromSender"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                  <input
                    onChange={handleInputChange}
                    type="text"
                    name="transferFromRecipient"
                    placeholder="recipient"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                  <input
                    onChange={handleInputChange}
                    type="text"
                    placeholder="amount"
                    name="transferFromAmount"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                </div>
                <button
                  onClick={transferFromAnotherAccount}
                  className="text-start button"
                >
                  Transact
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="w-full bg-yellow-100 flex flex-col rounded-lg border-solid border-2 border-black">
            <div className="flex justify-between items-center px-10 pt-5 w-full">
              <span>Transfer</span>
            </div>
            <div className="grid  grid-rows-[1fr] overflow-hidden px-10 py-5">
              <div className="overflow-hidden flex flex-col">
                <div className="flex flex-col gap-8">
                  <input
                    onChange={handleInputChange}
                    type="text"
                    placeholder="recipient"
                    name="transferRecipient"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                  <input
                    onChange={handleInputChange}
                    type="text"
                    placeholder="amount"
                    name="transferAmount"
                    className=" w-full lg:w-1/2 max-w-[650px] rounded-lg border-solid border-2 border-black p-2"
                  />
                </div>
                <button onClick={transfer} className="text-start button">
                  Transact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
