import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createConfig, createConnector, WagmiProvider} from "wagmi";
import {injected} from "@wagmi/core";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {connectorsForWallets, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {rainbowWallet} from "@rainbow-me/rainbowkit/wallets";
import {seiDevnet} from "viem/chains";
import {customSeiTransport} from "./app/seiTransport.ts";
import '@rainbow-me/rainbowkit/styles.css';

const compassWallet = () => ({
    id: "compass-wallet",
    name: "Compass Wallet",
    iconUrl: "https://svgur.com/i/15ad.svg",
    iconBackground: "transparent",
    createConnector: getInjectedConnector({target: window.compassEvm})
});

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [rainbowWallet],
        },
        {
            groupName: "Other",
            wallets: [compassWallet],
        },
    ],
    {
        appName: 'TestApp',
        projectId: 'TODO',
    }
);



// NOTE - Extracted from wagmi package
function getInjectedConnector({target}: any) {
    return createInjectedConnector(target);
}

// NOTE - Extracted from wagmi package
function createInjectedConnector(provider: any) {
    return (walletDetails: any) => {
        const injectedConfig = provider
            ? {
                target: () => ({
                    id: walletDetails.rkDetails.id,
                    name: walletDetails.rkDetails.name,
                    provider,
                }),
            }
            : {};
        return createConnector((config) => ({
            ...injected(injectedConfig)(config),
            ...walletDetails,
        }));
    };
}

const config = createConfig({
    chains: [seiDevnet],
    multiInjectedProviderDiscovery: false,
    transports: {
        [seiDevnet.id]: customSeiTransport,
    },
    connectors,
});


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={new QueryClient()}>
                <RainbowKitProvider>
                    <App/>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
)
