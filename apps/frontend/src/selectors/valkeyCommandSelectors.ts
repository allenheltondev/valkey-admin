import type { RootState } from "../store";

export const selectResponse = (state: RootState) => state.valkeycommand.response
export const selectError = (state: RootState) => state.valkeycommand.error