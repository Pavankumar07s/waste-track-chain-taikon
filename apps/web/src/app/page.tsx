'use client'
import { useState, useRef, useEffect } from 'react'
import { CustomDonutChart } from '@recycle-chain/ui/src/components/organisms/CustomDonutChart'
import { UserInfo } from '@recycle-chain/ui/src/components/organisms/UserInfo'
import { Logo } from '@recycle-chain/ui/src/components/organisms/Logo'
import { SustainabilityScene } from '@recycle-chain/3d/src/scenes/SustainabilityScene'
import Link from 'next/link'

export default function Home() {
  // State to track the position of the planet
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const draggingRef = useRef(false) // Ref to track the dragging state
  const initialPositionRef = useRef({ x: 0, y: 0 }) // Ref to store the initial mouse position

  // Event handlers to manage the dragging
  const onMouseDown = (e: { clientX: number; clientY: number }) => {
    draggingRef.current = true
    initialPositionRef.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    document.body.style.cursor = "grabbing" // Change cursor to indicate dragging
  }

  const onMouseMove = (e: { clientX: number; clientY: number }) => {
    if (draggingRef.current) {
      // Update the position of the planet while dragging
      setPosition({
        x: e.clientX - initialPositionRef.current.x,
        y: e.clientY - initialPositionRef.current.y,
      })
    }
  }

  const onMouseUp = () => {
    draggingRef.current = false
    document.body.style.cursor = "default" // Reset cursor when dragging stops
  }

  // Clean up mousemove and mouseup events when the component unmounts or on mouseup
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-white">
      {/* 3D Scene
      <div className="absolute inset-0 -z-10">
        <SustainabilityScene />
      </div> */}

      <div className="relative z-10 max-w-3xl p-6 md:p-12 text-white text-center md:text-left">
        <Logo />
        
        {/* Title with animated gradient */}
        <h1 className="font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight mb-4">
          Where is our{' '}
          <span className="bg-gradient-to-tr text-red-500 from-pink-500 to-red-500 bg-clip-text animate-pulse">
            waste?
          </span>{' '}
          Let’s find out...
        </h1>
        
        {/* Button Links */}
        <div className="flex justify-center md:justify-start gap-4 mt-8">
          <Link href="/manufacturers" className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition-transform transform hover:scale-105">
            Manufacturers
          </Link>
          <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition-transform transform hover:scale-105">
            Products
          </Link>
        </div>
      </div>

      {/* Planet and orbit effect */}
      <div className="absolute bottom-10 w-full flex justify-center">
        {/* Planet with slow rotation and interactive drag */}
        <div
          className="w-40 h-40 rounded-full bg-gradient-to-tl from-blue-500 via-green-500 to-yellow-500 animate-spin-slow planet-effect"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          onMouseDown={onMouseDown}
        ></div>

        {/* Orbit Lines */}
        <div className="absolute w-56 h-56 rounded-full border-2 border-dotted border-white opacity-60 animate-spin-slow"></div>
        <div className="absolute w-64 h-64 rounded-full border-2 border-dotted border-white opacity-40 animate-spin-slow"></div>

        {/* Waste flying around the planet */}
        <div className="absolute w-full h-full flex justify-center items-center animate-orbit ">
          <div className="w-4 h-4 bg-red-500 rounded-full absolute animate-ping delay-300"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full absolute animate-ping delay-500"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full absolute animate-ping delay-700"></div>
          <div className="w-5 h-5 bg-purple-600 rounded-full absolute animate-ping delay-900"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full absolute animate-ping delay-1100"></div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10"></div>
    </main>
  )
}
