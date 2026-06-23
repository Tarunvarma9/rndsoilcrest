'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function StarField({ count, color, size, opacity, speed }: {
  count: number
  color: string
  size: number
  opacity: number
  speed: number
}) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed
      ref.current.rotation.x += delta * speed * 0.6
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function Scene() {
  return (
    <>
      {/* White star field — many, tiny, like GMP */}
      <StarField count={1800} color="#ffffff" size={0.012} opacity={0.30} speed={0.03} />
      {/* Cyan-400 — GMP primary accent particles */}
      <StarField count={500}  color="#22d3ee" size={0.022} opacity={0.55} speed={0.045} />
      {/* Blue-500 — GMP gradient end, depth accent */}
      <StarField count={150}  color="#3b82f6" size={0.035} opacity={0.40} speed={0.02} />
    </>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene />
      </Canvas>
      {/* Vignette — darken edges so content stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(12,10,6,0.7) 100%)',
        }}
      />
    </div>
  )
}
