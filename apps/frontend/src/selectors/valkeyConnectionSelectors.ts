import type { RootState } from "../store";

export const selectStatus = (state: RootState) => state.valkeyconnection.status
export const selectConnected = (state: RootState) => state.valkeyconnection.connected
export const selectConnecting = (state: RootState) => state.valkeyconnection.connecting
export const selectRedirected = (state: RootState) => state.valkeyconnection.hasRedirected
export const selectError = (state: RootState) => state.valkeyconnection.status