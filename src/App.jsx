import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DetectionPanel from './components/DetectionPanel'
import ModelInfo from './components/ModelInfo'
import About from './components/About'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <DetectionPanel />
      <ModelInfo />
      <About />
      <Footer />
    </>
  )
}