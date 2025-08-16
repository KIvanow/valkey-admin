import './css/App.css'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setConnecting } from './features/wsconnection/wsConnectionSlice';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/ui/app-sidebar';
import { Outlet } from 'react-router';
import { Toaster } from './components/ui/sonner';



function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setConnecting(true))
  }, [dispatch])




  return (
    <SidebarProvider>
      <div className="flex min-h-screen app-container">
        <AppSidebar />
        <Outlet />
        <Toaster />
      </div>
    </SidebarProvider>
  )
}

export default App
