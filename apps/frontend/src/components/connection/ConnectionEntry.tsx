import type { ReactNode } from "react"
import type { ConnectionState } from "@/state/valkey-features/connection/connectionSlice"
import { CONNECTED } from "@common/src/constants.ts"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"
import { ActivityIcon, CircleChevronRight, PencilIcon, PowerIcon, Trash2Icon, UnplugIcon } from "lucide-react"
import history from "@/history.ts"
import { useAppDispatch } from "@/hooks/hooks.ts"
import { resetConnection } from "@/state/wsconnection/wsConnectionSlice.ts"

type ConnectionEntryProps = {
  connectionId: string,
  connection: ConnectionState,
}

const ConnectionEntryGrid = ({ children, className } : { children: ReactNode, className?: string}) =>
  <div className={cn("grid grid-cols-[10rem_2fr_1fr] items-center py-1", className)}>
    {children}
  </div>

export const ConnectionEntryHeader = () =>
  <ConnectionEntryGrid className="font-bold bg-gray-100 dark:bg-gray-900">
    <div className="pl-4">Status</div>
    <div>Instance</div>
    <div className="text-right pr-4">Actions</div>
  </ConnectionEntryGrid>

export const ConnectionEntry = ({ connectionId, connection }: ConnectionEntryProps) => {
  const dispatch = useAppDispatch()
  const handleDisconnect = () => dispatch(resetConnection())

  const isConnected = connection.status === CONNECTED

  return (
    <ConnectionEntryGrid>
      <div className={cn(isConnected ? "text-teal-500" : "text-gray-500", "flex flex-row pl-4")}>
        {isConnected ? <ActivityIcon className="mr-2" /> : <UnplugIcon className="mr-2" />}
        {connection.status}
      </div>
      <div>{connection.connectionDetails.username}@{connection.connectionDetails.host}:{connection.connectionDetails.port}</div>
      <div className="flex flex-row justify-end">
        {
          isConnected &&
          <>
            <Button onClick={() => history.navigate(`/${connectionId}/dashboard`)} variant="ghost">
              <CircleChevronRight />
              Open
            </Button>
            <Button onClick={() => alert("todo")} variant="ghost">
              <PencilIcon />
              Edit
            </Button>
            <Button onClick={handleDisconnect} variant="ghost">
              <PowerIcon />
              Disconnect
            </Button>
          </>
        }
        <Button className="text-destructive" variant="ghost">
          <Trash2Icon />
          Delete
        </Button>
      </div>
    </ConnectionEntryGrid>
  )
}
