import { createSlice } from "@reduxjs/toolkit"

interface HotKeysState {
  [connectionId: string]: {
    hotkeys: [[]],
    checkAt: string,
    monitorRunning: boolean,
    status: string 
  }
}

const initialHotKeysState: HotKeysState = {}

const hotKeysSlice = createSlice({
  name: "hotKeys",
  initialState: initialHotKeysState,
  reducers: {
    startMonitor: (state, payload) => {
      const connectionState = state[payload.connectionId]
      if (!connectionState.monitorRunning) connectionState.status = "pending"
    },
    hotKeysRequested: () => {
      // call after response from startMonitor and update
      // checkAt and monitorRunning
    },
    hotKeysFulfilled: () => {
      //update hotkeys and monitorRunninng

    },
    hotKeysError: () => {

    },
  },
})
