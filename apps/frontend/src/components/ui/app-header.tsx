import { useNavigate, useParams } from "react-router"
import { useSelector } from "react-redux"
import { useState, useRef, useEffect, type ReactNode } from "react"
import { CircleChevronDown, CircleChevronUp, Dot, CornerDownRight } from "lucide-react"
import { selectConnectionDetails } from "@/state/valkey-features/connection/connectionSelectors.ts"
import { selectCluster } from "@/state/valkey-features/cluster/clusterSelectors"
import { cn } from "@/lib/utils.ts"

type AppHeaderProps = {
  className?: string;
  title: string;
  icon: ReactNode;
};

function AppHeader({ title, icon, className }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { id, clusterId } = useParams<{ id: string; clusterId: string }>()
  const { host, port, username } = useSelector(selectConnectionDetails(id!))
  const clusterData = useSelector(selectCluster(clusterId!))
  const ToggleIcon = isOpen ? CircleChevronUp : CircleChevronDown

  const handleNavigate = (port: number) => {
    navigate(`/${clusterId}/localhost-${port}/dashboard`)
    setIsOpen(false)
  }

  // for closing the dropdown when we click anywhere in screen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      {id && !clusterId ? (
        <div className={cn("flex h-10 mb-4 gap-2 items-center justify-between", className)}>
          <h1 className="font-bold text-xl flex items-center gap-2">
            {icon}
            {title}
          </h1>

          <div className="">
            <span className="text-sm font-light border border-tw-primary text-tw-primary px-3 py-1 rounded">
              {username}@{host}:{port}
            </span>
          </div>
        </div>
      ) : (
        <div className={cn("flex h-10 mb-4 gap-2 items-center justify-between relative", className)}>
          <h1 className="font-bold text-xl flex items-center gap-2">
            {icon}
            {title}
          </h1>
          <div>
            <div className="h-5 w-50 px-2 py-4 border-tw-primary border rounded flex items-center gap-2 justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-light text-sm text-tw-primary flex items-center"><Dot className="text-green-500" size={45} />{id}</span>
              </div>
              <button onClick={() => setIsOpen(!isOpen)}>
                <ToggleIcon className="text-tw-primary cursor-pointer hover:text-tw-primary/80" size={18} />
              </button>
            </div>
            {isOpen && (
              <div className="p-4 w-50 py-3 border bg-gray-50 dark:bg-gray-800 text-sm dark:border-tw-dark-border 
                rounded z-10 absolute top-10 right-0" ref={dropdownRef}>
                <ul className="space-y-2">
                  {Object.entries(clusterData.clusterNodes).map(([primaryKey, primary]) => (
                    <li className="flex flex-col gap-1" key={primaryKey}>
                      <button className="font-normal flex items-center cursor-pointer hover:bg-tw-primary/20"
                        onClick={() => handleNavigate(primary.port)}>
                        <Dot className="text-green-500" size={45} />
                        {primaryKey}</button>
                      {primary.replicas?.map((replica) => (
                        <div className="flex items-center ml-4">
                          <CornerDownRight className="text-tw-dark-border" size={20} />
                          <button className="font-normal flex items-center text-xs">
                            <Dot className="text-tw-primary" size={24} />{replica.host}:{replica.port}
                          </button>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  )
}

export { AppHeader }
