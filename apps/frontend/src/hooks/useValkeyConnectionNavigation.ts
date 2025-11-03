import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router"
import { CONNECTING, ERROR } from "@common/src/constants"
import type { RootState } from "@/store"

export function useValkeyConnectionNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: connectionId, clusterId } = useParams<{ id: string; clusterId?: string }>()

  const connection = useSelector((state: RootState) =>
    connectionId ? state.valkeyConnection?.connections?.[connectionId] : null,
  )

  const previousStatus = useRef(connection?.status)

  useEffect(() => {
    if (!connectionId || !connection) {
      return
    }

    const currentStatus = connection.status
    const isRetrying = connection.reconnect?.isRetrying
    const isOnReconnectPage = location.pathname.includes("/valkey-reconnect")

    if (isOnReconnectPage || location.pathname === "/connect" || location.pathname === "/settings") {
      previousStatus.current = currentStatus
      return
    }

    // if we should navigate to reconnect page
    const shouldNavigate =
      (currentStatus === CONNECTING && isRetrying) ||
          (currentStatus === ERROR && isRetrying) ||
          (currentStatus === ERROR && connection.reconnect && !isRetrying)

    if (shouldNavigate && !isOnReconnectPage) {
      sessionStorage.setItem(`valkey-previous-${connectionId}`, location.pathname)
      const reconnectPath = clusterId
        ? `/${clusterId}/${connectionId}/valkey-reconnect`
        : `/${connectionId}/valkey-reconnect`
      navigate(reconnectPath, { replace: true })
    }

    previousStatus.current = currentStatus
  }, [
    connection?.status,
    connection?.reconnect?.isRetrying,
    location.pathname,
    navigate,
    connectionId,
    clusterId,
  ])
}
