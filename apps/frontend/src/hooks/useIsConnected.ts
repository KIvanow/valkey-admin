import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { CONNECTED, CONNECTING, DISCONNECTED, ERROR } from "@common/src/constants.ts"
import { selectStatus } from "@/state/valkey-features/connection/connectionSelectors.ts"

const useIsConnected = (): boolean => {
  const { id } = useParams<{ id: string }>()
  const status = useSelector(selectStatus(id!))
  // user will stay in the page if connected, disconnected, connecting, or in error state
  return status === CONNECTED || status === DISCONNECTED || status === CONNECTING || status === ERROR
}

export default useIsConnected
