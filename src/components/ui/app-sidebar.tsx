import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar"
import { selectConnected, setConnected as valkeySetConnected } from "@/features/valkeyconnection/valkeyConnectionSlice"
import { useSelector } from "react-redux"
import { Button } from "./button"
import { useAppDispatch } from "@/hooks/hooks"
import { useNavigate, Link } from "react-router"

export function AppSidebar() {
    const isConnected = useSelector(selectConnected)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleDisconnect = () => {
        dispatch(valkeySetConnected(false))
        navigate("/connect")
    }
    return (
        <Sidebar>
            <SidebarHeader>
                Skyscope
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem key="Connection">
                            <SidebarMenuButton asChild>
                                <Link to="/connect">Connect</Link>
                            </SidebarMenuButton>
                            {isConnected && (
                                <>
                                    <SidebarMenuButton asChild>
                                        <Link to="/sendcommand">Send Command</Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuButton asChild>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuButton asChild>
                                        <div className="flex justify-end">
                                            <Button onClick={handleDisconnect}>
                                                Disconnect
                                            </Button>
                                        </div>
                                    </SidebarMenuButton>
                                </>
                            )
                            }
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    )
}


