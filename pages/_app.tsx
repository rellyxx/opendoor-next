import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli,],
  [alchemyProvider({ apiKey: 'v54XKO_i8u4kDLFXG8PNQH32fJFQK6QH'  }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "openDoor",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
import { appWithTranslation } from 'next-i18next'


const App=({ Component, pageProps }: AppProps)=> {
  return <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider theme={darkTheme()} chains={chains}>
              <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
}
export default appWithTranslation(App/*, nextI18NextConfig */)
