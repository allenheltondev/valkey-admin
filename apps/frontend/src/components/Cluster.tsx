import { useSelector } from "react-redux"
import { Server } from "lucide-react"
import { useParams } from "react-router"
import { AppHeader } from "./ui/app-header"
import ClusterNode from "./ui/cluster-node"
import { selectCluster } from "@/state/valkey-features/cluster/clusterSelectors"

export function Cluster() {
  const { clusterId } = useParams()
  const clusterData = useSelector(selectCluster(clusterId!))

  console.log("clusterData::", clusterData)

  if (!clusterData || !clusterData.clusterNodes || !clusterData.data) {
    return (
      <div className="p-4 h-full flex flex-col">
        <AppHeader icon={<Server size={20} />} title="Cluster Topology" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-tw-dark-border text-center">
            No cluster data available
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <AppHeader icon={<Server size={20} />} title="Cluster Topology" />

      <div className="flex flex-wrap gap-4 mt-4">
        {Object.entries(clusterData.clusterNodes).map(([primaryKey, primary]) => {
          const primaryData = clusterData.data[primaryKey]
          return (
            <ClusterNode
              allNodeData={clusterData.data}
              clusterId = {clusterId!}
              key={primaryKey}
              primary={primary}
              primaryData={primaryData}
              primaryKey={primaryKey}
            />
          )
        })}
      </div>
    </div>
  )
}
