import { useState, useEffect } from "react";
import {
  getAuthToken,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { encodeFunctionData } from "viem";
import "./Methods.css";

export default function DynamicMethods({ isDarkMode }) {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet, _internal } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("");
  const [mintStatus, setMintStatus] = useState(null);

  const safeStringify = (obj) => {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]";
          }
          seen.add(value);
        }
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      },
      2,
    );
  };

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  function clearResult() {
    setResult("");
    setMintStatus(null);
  }

  async function verifyJwt() {
    clearResult();
    const authToken = getAuthToken();

    try {
      const response = await fetch("http://localhost:9000/api", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const verificationResult = await response.json();
      setResult(safeStringify(verificationResult));
    } catch (error) {
      setResult(
        safeStringify({
          verified: false,
          error: error.message || "Failed to verify JWT",
        }),
      );
    }
  }

  async function mintNFT() {
    clearResult();
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    try {
      const publicClient = await primaryWallet.getPublicClient();
      const walletClient = await primaryWallet.getWalletClient();
      const address = await walletClient.getAddresses();

      // Encode the safeMint function call
      const data = encodeFunctionData({
        abi: [
          {
            inputs: [{ name: "to", type: "address" }],
            name: "safeMint",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "safeMint",
        args: [address[0]],
      });

      const transaction = {
        to: "0xBaee5E20983614F8e5Ca0f529896aEC38E6e3ed4", // NFT contract address
        data,
      };

      // Send the NFT mint transaction to the blockchain
      const hash = await walletClient.sendTransaction(transaction);
      setMintStatus({ status: "pending", hash });

      const receipt = await publicClient.getTransactionReceipt({
        hash,
      });

      // Extract relevant information from the receipt
      const userAddress =
        "0x" + receipt.logs[2].topics[2].slice(26).toLowerCase();
      const paymasterAddress =
        "0x" + receipt.logs[4].topics[3].slice(26).toLowerCase();

      setMintStatus({
        status: "success",
        hash,
        userAddress,
        paymasterAddress,
      });
    } catch (error) {
      setMintStatus({ status: "error", message: error.message });
    }
  }

  async function showCookieInfo() {
    clearResult();
    try {
      const authToken = _internal?.getAuthToken?.();

      const cookieInfo = {
        cookiePresent: !!authToken,
        tokenType: "HttpOnly",
        domain: window.location.hostname,
        tokenLength: authToken ? authToken.length : 0,
      };

      setResult(safeStringify(cookieInfo));
    } catch (error) {
      setResult(
        JSON.stringify(
          {
            cookiePresent: false,
            error: error.message || "Failed to access token information",
          },
          null,
          2,
        ),
      );
    }
  }

  return (
    <>
      {!isLoading && (
        <div
          className="dynamic-methods"
          data-theme={isDarkMode ? "dark" : "light"}
        >
          <div className="methods-container">
            <button className="btn btn-primary" onClick={mintNFT}>
              Mint NFT
            </button>
            <button className="btn btn-primary" onClick={verifyJwt}>
              Verify JWT
            </button>
            <button className="btn btn-primary" onClick={showCookieInfo}>
              Show Cookie Info
            </button>
          </div>
          {mintStatus && (
            <div className="results-container">
              <pre className="results-text">
                {mintStatus.status === "success" && (
                  <>
                    NFT successfully minted!{" "}
                    <a
                      href={`https://amoy.polygonscan.com/tx/${mintStatus.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See the blockchain transaction details
                    </a>
                    <br />
                    <br />
                    NFT owned by your address,{" "}
                    <a
                      href={`https://amoy.polygonscan.com/address/${mintStatus.userAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mintStatus.userAddress}
                    </a>
                    <br />
                    <br />
                    Transaction fee sponsored by Pimlico at address{" "}
                    <a
                      href={`https://amoy.polygonscan.com/address/${mintStatus.paymasterAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mintStatus.paymasterAddress}
                    </a>
                  </>
                )}
              </pre>
            </div>
          )}
          {result && (
            <div className="results-container">
              <pre className="results-text">
                {result &&
                  (typeof result === "string" && result.startsWith("{")
                    ? JSON.stringify(JSON.parse(result), null, 2)
                    : result)}
              </pre>
            </div>
          )}
          {(result || mintStatus) && (
            <div className="clear-container">
              <button className="btn btn-primary" onClick={clearResult}>
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
