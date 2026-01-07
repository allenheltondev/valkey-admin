type CpuUsageResponse = Array<{
  timestamp: number
  value: number
}>

type TimeRange = "1h" | "6h" | "12h"

export const downsampleData = (
  data: CpuUsageResponse,
  bucketSizeMs: number,
): CpuUsageResponse => {
  if (data.length === 0) return []
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp)

  // group into buckets
  const buckets = new Map<number, number[]>()
  for (const point of sortedData) {
    const bucketKey = Math.floor(point.timestamp / bucketSizeMs) * bucketSizeMs
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, [])
    }
    buckets.get(bucketKey)!.push(point.value)
  }

  // calculate average for each bucket
  const downsampled: CpuUsageResponse = []
  for (const [bucketTimestamp, values] of buckets.entries()) {
    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    downsampled.push({
      timestamp: bucketTimestamp,
      value: Math.round(average * 1000) / 1000,
    })
  }

  return downsampled.sort((a, b) => a.timestamp - b.timestamp)
}

// bucket sizes in milliseconds (1 minute = ~60 points for 1h range, 3 minutes = ~120 points for 6h and 5 minutes = ~144 points for 12h)
export const getBucketSize = (timeRange: TimeRange): number => {
  const bucketSizes = {
    "1h": 1 * 60 * 1000,
    "6h": 3 * 60 * 1000,      
    "12h": 5 * 60 * 1000,    
  }
  return bucketSizes[timeRange]
}
