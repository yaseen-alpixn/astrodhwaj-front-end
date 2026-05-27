"use client";

import { createContext, PropsWithChildren, useContext } from "react";

import { useSocket } from "@/hooks/useSocket";

const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export function SocketProvider({ path, children }: PropsWithChildren<{ path: string | null }>) {
  const socket = useSocket(path);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
