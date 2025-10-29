import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { CONNECTED, CONNECTING, ERROR } from "@common/src/constants"
import { Loader2, WifiOff, AlertCircle } from "lucide-react"
import type { RootState } from "@/store"

export function Reconnect() {
  const navigate = useNavigate()
  const wsConnection = useSelector((state: RootState) => state.websocket)
  const { status, reconnect } = wsConnection

  const previousLocation = sessionStorage.getItem("previousLocation") || "/connect"

  useEffect(() => {
    // redirect to previous location on successful connection
    if (status === CONNECTED) {
      const redirectTo = sessionStorage.getItem("previousLocation") || "/connect"
      sessionStorage.removeItem("previousLocation")
      navigate(redirectTo, { replace: true })
    }
  }, [status, navigate])

  useEffect(() => {
    // if could not connect redirect to /connect after 3 seconds
    if (status === ERROR && !reconnect.isRetrying) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem("previousLocation")
        navigate("/connect", { replace: true })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, reconnect.isRetrying, navigate])

  const getProgressPercentage = () => {
    if (reconnect.maxRetries === 0) return 0
    return ((reconnect.currentAttempt) / reconnect.maxRetries) * 100
  }

  const getNextRetrySeconds = () => {
    if (!reconnect.nextRetryDelay) return 0
    return Math.ceil(reconnect.nextRetryDelay / 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-center">
          {status === CONNECTING && reconnect.isRetrying ? (
            <div className="relative">
              <Loader2 className="w-16 h-16 text-tw-primary animate-spin" />
            </div>
          ) : status === ERROR ? (
            <AlertCircle className="w-12 h-12 text-red-500" />
          ) : (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
              <WifiOff className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {status === ERROR && !reconnect.isRetrying
              ? "Connection Failed"
              : "Reconnecting..."}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {status === ERROR && !reconnect.isRetrying
              ? "Unable to establish connection to the server"
              : "Attempting to restore your connection"}
          </p>
        </div>

        {/* Retry Progress */}
        {reconnect.isRetrying && (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-tw-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            {/* Retry Information */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Attempt {reconnect.currentAttempt} of {reconnect.maxRetries}
              </span>
              {reconnect.nextRetryDelay && (
                <span className="text-gray-600 dark:text-gray-400">
                  Next retry in {getNextRetrySeconds()}s
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4">
          {previousLocation !== "/connect" && (
            <button
              className="w-full border p-2 rounded bg-tw-primary text-white hover:bg-tw-primary/60 cursor-pointer"
              onClick={() => {
                sessionStorage.removeItem("previousLocation")
                navigate("/connect", { replace: true })
              }}
            >
              Cancel and Return to Connections
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
