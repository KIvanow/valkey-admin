import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.tsx'
import { Connection } from './features/valkeyconnection/valkeyConnection.tsx'
import { Dashboard } from './features/valkeyinfo/valkeyInfo.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Routes, Route } from "react-router";
import { SendCommand } from './features/valkeycommand/valkeyCommand.tsx'
import RequireConnection from './components/RequireConnection.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/connect" element={<Connection />} />
          <Route element={<RequireConnection />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sendcommand" element={<SendCommand />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
  // </StrictMode>,
)
