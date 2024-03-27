import { http } from '@wagmi/core'
import { getDefaultConfig} from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from '@wagmi/core/chains'

export const config = getDefaultConfig({
    appName: "Loreum",
    projectId: "YOUR_PROJECT_ID",
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      // [sepolia.id]: http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`),
      [sepolia.id]: http(),
    },
  });