import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import { CoachAuthProvider } from './components/CoachAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CoachAuthProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </CoachAuthProvider>
  </StrictMode>
)
