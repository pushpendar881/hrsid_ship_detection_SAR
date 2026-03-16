import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SARInfo from './components/SARInfo'
import DetectionPanel from './components/DetectionPanel'
import ModelInfo from './components/ModelInfo'
import About from './components/About'
import DetectionHistory from './components/DetectionHistory'
import UserAnalytics from './components/UserAnalytics'
import SimpleAuth from './components/SimpleAuth'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <SimpleAuth />
      <Navbar />
      <Hero />
      <SARInfo />
      <DetectionPanel />
      <ModelInfo />
      <About />
      <DetectionHistory />
      <UserAnalytics />
      <Footer />
    </>
  )
}