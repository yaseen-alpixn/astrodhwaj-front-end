"use client";

import { createContext, useContext, type PropsWithChildren } from "react";

import OfflineOverlay from "@/components/system/OfflineOverlay";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type NetworkContextValue = ReturnType<typeof useNetworkStatus>;

const NetworkContext = createContext<NetworkContextValue>({ isOnline: true, reconnecting: false });

export function NetworkProvider({ children }: PropsWithChildren) {
  const network = useNetworkStatus();

  return (
    <NetworkContext.Provider value={network}>
      <div className={network.isOnline ? "" : "pointer-events-none select-none blur-[1px]"}>
        {children}
      </div>
      <OfflineOverlay isOnline={network.isOnline} />
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return useContext(NetworkContext);
}
