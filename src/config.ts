import { http } from '@wagmi/core'
import { getDefaultConfig} from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from '@wagmi/core/chains'

export const config = getDefaultConfig({
    appName: "Loreum",
    projectId: "YOUR_PROJECT_ID",
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http('https://rpc.ankr.com/eth_sepolia/b8296c414c45b6feee3e95b523cd70b9d9ffacc3563ecb040532183efc064b18'),
    },
  });