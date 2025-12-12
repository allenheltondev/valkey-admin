import { ALLKEYS_LFU, VOLATILE_LFU } from "../utils/constants"

export const isEvictionPolicyLFU = async (client) => {
  const result = await client.sendCommand(["MEMORY", "STATS"])
  return result === VOLATILE_LFU || result === ALLKEYS_LFU
}
function isClusterEnabled(info) {
  const line = info.split("\n").find((line) => line.startsWith("cluster_enabled:"))
  const value = line.split(":")[1]
  return value === "1" 
}
export async function belongsToCluster(client) {
  const response = await client.sendCommand(["INFO", "CLUSTER"])
  return isClusterEnabled(response)
}
