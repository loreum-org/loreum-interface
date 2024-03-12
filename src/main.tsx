import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Nav from "./components/NavBar";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import theme from "./theme";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "@fontsource/cairo/200.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Chamber from "./pages/Chamber";
import Proposal from "./pages/Proposal";
import Assests from "./pages/Assest";
import Transaction from "./pages/Transaction";
import Leaderboard from "./pages/Leaderboard";
import Forum from "./pages/Forum";
import Setting from "./pages/Setting";
import ChamberHome from "./pages/ChamberHome";
import Send from "./pages/Send";
import Builder from "./pages/Builder";
import Token from "./pages/Token";
import NFT from "./pages/NFT";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/chamber/:address",
    element: <Chamber/>,
    children:[
      {
        path:'/chamber/:address/',
        element:<ChamberHome/>
      },
      {
        path:'/chamber/:address/proposal',
        element:<Proposal/>
      },
      {
        path:'/chamber/:address/assest',
        element:<Assests/>
      },
      {
        path:'/chamber/:address/transaction',
        element:<Transaction/>
      },
      {
        path:'/chamber/:address/leaderboard',
        element:<Leaderboard/>
      },
      {
        path:'/chamber/:address/forum',
        element:<Forum/>
      },
      {
        path:'/chamber/:address/setting',
        element:<Setting/>
      },
      {
        path:'/chamber/:address/transaction/send',
        element:<Send/>
      },
      {
        path:'/chamber/:address/transaction/send/builder',
        element:<Builder/>
      },
      {
        path:'/chamber/:address/transaction/send/token',
        element:<Token/>
      },
      {
        path:'/chamber/:address/transaction/send/nft',
        element:<NFT/>
      }
    ]
  },
]);

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Loreum",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, zora, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <div style={{ height: "100vh" }}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Nav />
              <RouterProvider router={router} />
              <Footer />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    </ChakraProvider>
  </React.StrictMode>
);
