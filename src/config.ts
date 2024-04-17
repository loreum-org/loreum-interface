import { http } from '@wagmi/core'
import { getDefaultConfig} from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from '@wagmi/core/chains'

export const config = getDefaultConfig({
    appName: "Loreum",
    projectId: "YOUR_PROJECT_ID",
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http('https://sepolia.infura.io/v3/615016a7e58a4ad0ad688a4a5849d55f'),
    },
  });