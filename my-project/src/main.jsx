import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import { CoachAuthProvider } from './components/CoachAuthContext.jsx'
import { DataSyncProvider } from './components/DataSyncContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataSyncProvider>
    <CoachAuthProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </CoachAuthProvider>
    </DataSyncProvider>
  </StrictMode>
)
