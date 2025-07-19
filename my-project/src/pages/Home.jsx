import React from 'react'
import LandingPage from '../components/LandingPage'
import Textarea from '../components/Textarea'
import Herosec from '../components/Herosec'
import Assess from '../components/Assess'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <LandingPage />      
      <Textarea />
      <Herosec />
      <Assess />
      <Footer />    
    </div>
  )
}

export default Home
