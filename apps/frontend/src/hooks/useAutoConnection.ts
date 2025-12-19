import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "./hooks"
import { connectPending } from "@/state/valkey-features/connection/connectionSlice"
import { sanitizeUrl } from "@common/src/url-utils"
import { CONNECTED } from "@common/src/constants"
import type { RootState } from "@/store"

export function useAutoConnection() {
  const dispatch = useAppDispatch()
  const wsStatus = useSelector((state: RootState) => state.websocket.status)

  useEffect(() => {
    // Only attempt auto-connection when WebSocket is connected
    if (wsStatus !== CONNECTED) {
      console.log("Auto-connection waiting for WebSocket connection...")
      return
    }

    const host = import.meta.env.VITE_LOCAL_VALKEY_HOST
    const port = import.meta.env.VITE_LOCAL_VALKEY_PORT
    const alias = import.meta.env.VITE_LOCAL_VALKEY_NAME

    console.log("Auto-connection environment variables:", { host, port, alias })

    if (host && port) {
      const connectionId = sanitizeUrl(`${host}-${port}`)

      console.log(`Auto-connecting to local Valkey cluster: ${host}:${port}`)
      console.log("Connection details:", { host, port, username: "", password: "", alias: alias || "Local Valkey Cluster", connectionId })

      // Add a small delay to ensure WebSocket is fully ready
      setTimeout(() => {
        dispatch(
          connectPending({
            host,
            port: String(port),
            username: "",
            password: "",
            alias: alias || "Local Valkey Cluster",
            connectionId,
          })
        )
      }, 1000)
    } else {
      console.log("Auto-connection skipped - missing environment variables")
    }
  }, [dispatch, wsStatus])
}
