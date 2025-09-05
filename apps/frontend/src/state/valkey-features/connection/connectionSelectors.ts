import * as R from "ramda"
import type { RootState } from "@/store.ts"
import { VALKEY } from "@common/src/constants.ts"

const atId = (id: string, state: RootState) => R.path([VALKEY.CONNECTION.name, "connections", id], state)

export const selectStatus = (id: string) => (state: RootState) => atId(id, state)?.status
export const selectError = (id: string) => (state: RootState) => atId(id, state)?.status
export const selectConnectionDetails = (id: string) => (state: RootState) => atId(id, state)?.connectionDetails
