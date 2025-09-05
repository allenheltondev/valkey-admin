import type { Store } from "@reduxjs/toolkit"
import { merge } from "rxjs"
import { ignoreElements, tap } from "rxjs/operators"
import { getSocket } from "./wsEpics"
import { connectFulfilled, connectPending, resetConnection } from "../valkey-features/connection/connectionSlice"
import { sendRequested } from "../valkey-features/command/commandSlice"
import { setData } from "../valkey-features/info/infoSlice"
import { action$, select } from "../middleware/rxjsMiddleware/rxjsMiddlware"
import history from "@/history.ts"

export const connectionEpic = (store: Store) =>
  merge(
    action$.pipe(
      select(connectPending),
      tap((action) => {
        const socket = getSocket()
        console.log("Sending message to server from connecting epic...")
        socket.next(action)
      }),
      ignoreElements(),
    ),

    action$.pipe(
      select(connectFulfilled),
      tap(action => {
        console.log("here")
        console.log(history)
        history.navigate(`/${action.payload.connectionId}/dashboard`)
      }),
    ),
  )


export const sendRequestEpic = () =>
  action$.pipe(
    select(sendRequested),
    tap((action) => {
      const socket = getSocket()
      socket.next(action)
    }),
  )

export const setDataEpic = () =>
  action$.pipe(
    select(connectFulfilled),
    tap(({ payload: { connectionId } }) => {
      const socket = getSocket()
      socket.next({ type: setData.type, payload: { connectionId } })
    }),
  )

export const disconnectEpic = () =>
  action$.pipe(
    select(resetConnection),
    tap((action) => {
      const socket = getSocket()
      socket.next(action)
    }),
    ignoreElements(),
  )
