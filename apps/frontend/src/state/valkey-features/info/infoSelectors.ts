import type { RootState } from "@/store.ts";
import { VALKEY } from "@common/src/constants.ts"

export const selectData = (id: string) => (state: RootState) => {

    return state[VALKEY.STATS.name]?.[id]?.data ?? null
}


