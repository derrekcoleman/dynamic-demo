import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import Main from "./Main";

const App = () => (
  <DynamicContextProvider
    theme="auto"
    settings={{
      // apiBaseUrl: "https://auth.dynamic-demo.xyz/api/v0",
      environmentId: "8005230e-7f6f-472e-bf7b-b0e26b270698",
      walletConnectors: [
        EthereumWalletConnectors,
        ZeroDevSmartWalletConnectorsWithConfig({
          bundlerRpc:
            "https://rpc.zerodev.app/api/v2/bundler/ba9facf9-1061-4e2f-925c-fe2e2e93d879?provider=PIMLICO",
          paymasterRpc:
            "https://rpc.zerodev.app/api/v2/paymaster/ba9facf9-1061-4e2f-925c-fe2e2e93d879?provider=PIMLICO",
        }),
      ],
    }}
  >
    <Main />
  </DynamicContextProvider>
);

export default App;
