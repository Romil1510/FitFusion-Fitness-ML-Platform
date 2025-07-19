import LandingPage from './components/LandingPage.jsx'
import Textarea from './components/Textarea.jsx'
import Herosec from './components/Herosec.jsx'
import Footer from './components/Footer.jsx'
import Assess from './components/Assess.jsx'
import Signin from "./pages/Signin.jsx"
import Navbar from './components/Navbar.jsx'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'

function App() {

  return (
    <>
    <Router>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path='/login' element={<Signin/>}/>
    <Route path='/signup' element={<Signup/>}/>
    </Routes>
   
    </Router>

    </>
  )
}

export default App
