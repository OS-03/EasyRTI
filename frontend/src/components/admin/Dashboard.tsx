import React from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import AdminHeroSection from './AdminHeroSection'

function Dashboard() {
  return (
    <div>
        <Navbar/>
        <AdminHeroSection/>
        <Footer/>
    </div>
  )
}

export default Dashboard