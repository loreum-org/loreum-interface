import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Nav from "./components/NavBar";
import NotFoundPage from "./pages/NotFoundPage";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/cairo/200.css";
import theme from "./theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
]);

const queryClient = new QueryClient();


const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, zora, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <div style={{ height: "100vh" }}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Nav />
              <RouterProvider router={router} />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    </ChakraProvider>
  </React.StrictMode>
);
