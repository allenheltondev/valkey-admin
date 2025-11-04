interface retryProgressProps {
    nextRetryDelay : number 
}

export default function RetryProgress({ nextRetryDelay }: retryProgressProps) {
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          key={nextRetryDelay}
          className="bg-tw-primary h-full animate-linear-progress"
          style={{
            animationDuration: `${nextRetryDelay}ms`,
          }}
        />
      </div>
    )
  }
