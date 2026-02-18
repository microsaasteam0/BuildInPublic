'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, RotateCw, RotateCcw, ZoomIn, ZoomOut, Check, FlipHorizontal, FlipVertical, RefreshCw, Sun, Contrast, Move } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

interface ImageEditorProps {
  imageUrl: string
  onSave: (canvas: HTMLCanvasElement) => void
  onCancel: () => void
  isOpen: boolean
}

export default function ImageEditor({ imageUrl, onSave, onCancel, isOpen }: ImageEditorProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [activeTab, setActiveTab] = useState<'transform' | 'adjust'>('transform')
  // Responsive canvas size — fills available width on mobile
  const [canvasSize, setCanvasSize] = useState(380)

  useEffect(() => {
    const update = () => {
      // modal max-w-lg = 512px, subtract 2×padding (16px each side) and border
      const available = Math.min(window.innerWidth - 32, 512 - 32)
      setCanvasSize(Math.max(240, Math.min(380, available)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── Load image ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !imageUrl) return
    setIsLoading(true)
    setError(null)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
      const canvas = canvasRef.current
      if (canvas) {
        const sz = Math.max(240, Math.min(380, Math.min(window.innerWidth - 32, 512 - 32)))
        canvas.width = sz
        canvas.height = sz
        const scaleX = canvas.width / img.width
        const scaleY = canvas.height / img.height
        const initialScale = Math.max(scaleX, scaleY) * 0.85
        setScale(initialScale)
        setPosition({
          x: (canvas.width - img.width * initialScale) / 2,
          y: (canvas.height - img.height * initialScale) / 2,
        })
      }
      setIsLoading(false)
    }
    img.onerror = () => {
      setError('Failed to load image. Please try again.')
      setIsLoading(false)
    }
    img.src = imageUrl
  }, [isOpen, imageUrl])

  // ── Draw canvas ──────────────────────────────────────────────────────────
  const drawCanvas = useCallback(() => {
    if (!image || isLoading) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`

    ctx.save()
    const centerX = position.x + (image.width * scale) / 2
    const centerY = position.y + (image.height * scale) / 2
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipH ? -scale : scale, flipV ? -scale : scale)
    ctx.translate(-image.width / 2, -image.height / 2)
    ctx.drawImage(image, 0, 0)
    ctx.restore()

    ctx.filter = 'none'
    drawCropOverlay(ctx, canvas)
    updatePreview(canvas)
  }, [image, position, scale, rotation, flipH, flipV, brightness, contrast, isLoading, isDark])

  useEffect(() => { drawCanvas() }, [drawCanvas])

  const drawCropOverlay = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const cropSize = Math.min(canvas.width, canvas.height) * 0.92
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = cropSize / 2

    // ── Build overlay on an offscreen canvas so destination-out
    //    never touches the image pixels on the main canvas ──────────────────
    const offscreen = document.createElement('canvas')
    offscreen.width = canvas.width
    offscreen.height = canvas.height
    const oc = offscreen.getContext('2d')!

    // 1. Fill the whole offscreen with the dim colour
    oc.fillStyle = isDark ? 'rgba(2, 6, 23, 0.72)' : 'rgba(241, 245, 249, 0.80)'
    oc.fillRect(0, 0, offscreen.width, offscreen.height)

    // 2. Cut a circular hole — only affects the offscreen canvas
    oc.globalCompositeOperation = 'destination-out'
    oc.beginPath()
    oc.arc(cx, cy, r, 0, Math.PI * 2)
    oc.fill()
    oc.globalCompositeOperation = 'source-over'

    // 3. Stamp the offscreen overlay onto the main canvas (image stays intact)
    ctx.drawImage(offscreen, 0, 0)

    // ── Decorative elements drawn directly on main canvas ─────────────────
    ctx.save()

    // Circle border gradient
    const gradient = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
    gradient.addColorStop(0, '#6366f1')
    gradient.addColorStop(0.5, '#8b5cf6')
    gradient.addColorStop(1, '#06b6d4')
    ctx.strokeStyle = gradient
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()

    // Rule-of-thirds grid (clipped inside circle)
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()
    ctx.strokeStyle = isDark ? 'rgba(99,102,241,0.28)' : 'rgba(99,102,241,0.40)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    const third = (r * 2) / 3
    for (let i = 1; i <= 2; i++) {
      const lx = cx - r + third * i
      ctx.beginPath(); ctx.moveTo(lx, cy - r); ctx.lineTo(lx, cy + r); ctx.stroke()
      const ly = cy - r + third * i
      ctx.beginPath(); ctx.moveTo(cx - r, ly); ctx.lineTo(cx + r, ly); ctx.stroke()
    }
    ctx.setLineDash([])
    ctx.restore()

    // Corner arc handles
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 3
      ;[-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4].forEach(angle => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, angle - 0.3, angle + 0.3)
        ctx.stroke()
      })

    ctx.restore()
  }

  const updatePreview = (mainCanvas: HTMLCanvasElement) => {
    const preview = previewCanvasRef.current
    if (!preview) return
    const ctx = preview.getContext('2d')
    if (!ctx) return
    const size = 80
    preview.width = size
    preview.height = size
    const cropSize = Math.min(mainCanvas.width, mainCanvas.height) * 0.92
    const cropX = (mainCanvas.width - cropSize) / 2
    const cropY = (mainCanvas.height - cropSize) / 2
    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(mainCanvas, cropX, cropY, cropSize, cropSize, 0, 0, size, size)
    ctx.restore()
  }

  // ── Mouse / Touch handlers ────────────────────────────────────────────────
  const getCanvasPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pt = getCanvasPoint(e.clientX, e.clientY)
    setIsDragging(true)
    setDragStart({ x: pt.x - position.x, y: pt.y - position.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const pt = getCanvasPoint(e.clientX, e.clientY)
    setPosition({ x: pt.x - dragStart.x, y: pt.y - dragStart.y })
  }
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0]
      const pt = getCanvasPoint(t.clientX, t.clientY)
      setIsDragging(true)
      setDragStart({ x: pt.x - position.x, y: pt.y - position.y })
    }
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDragging || e.touches.length !== 1) return
    const t = e.touches[0]
    const pt = getCanvasPoint(t.clientX, t.clientY)
    setPosition({ x: pt.x - dragStart.x, y: pt.y - dragStart.y })
  }
  const handleMouseUp = () => setIsDragging(false)

  // ── Controls ──────────────────────────────────────────────────────────────
  const handleZoom = (delta: number) => setScale(prev => Math.max(0.3, Math.min(4, prev + delta)))
  const handleRotateCW = () => setRotation(prev => (prev + 90) % 360)
  const handleRotateCCW = () => setRotation(prev => (prev - 90 + 360) % 360)

  const handleReset = () => {
    if (!image) return
    const canvas = canvasRef.current
    if (!canvas) return
    const initialScale = Math.max(canvas.width / image.width, canvas.height / image.height) * 0.85
    setScale(initialScale)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    setBrightness(100)
    setContrast(100)
    setPosition({
      x: (canvas.width - image.width * initialScale) / 2,
      y: (canvas.height - image.height * initialScale) / 2,
    })
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!image) return
    const canvas = canvasRef.current
    if (!canvas) return
    const resultCanvas = document.createElement('canvas')
    const resultCtx = resultCanvas.getContext('2d')
    if (!resultCtx) return
    const size = 400
    resultCanvas.width = size
    resultCanvas.height = size
    const cropSize = Math.min(canvas.width, canvas.height) * 0.92
    const cropX = (canvas.width - cropSize) / 2
    const cropY = (canvas.height - cropSize) / 2
    const ratio = size / cropSize
    resultCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
    resultCtx.save()
    resultCtx.scale(ratio, ratio)
    resultCtx.translate(-cropX, -cropY)
    const centerX = position.x + (image.width * scale) / 2
    const centerY = position.y + (image.height * scale) / 2
    resultCtx.translate(centerX, centerY)
    resultCtx.rotate((rotation * Math.PI) / 180)
    resultCtx.scale(flipH ? -scale : scale, flipV ? -scale : scale)
    resultCtx.translate(-image.width / 2, -image.height / 2)
    resultCtx.drawImage(image, 0, 0)
    resultCtx.restore()
    onSave(resultCanvas)
  }

  // ── Reset on close ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true); setError(null); setImage(null)
      setScale(1); setRotation(0); setPosition({ x: 0, y: 0 })
      setIsDragging(false); setFlipH(false); setFlipV(false)
      setBrightness(100); setContrast(100)
    }
  }, [isOpen])

  if (!isOpen) return null

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const t = {
    // Modal shell
    bg: isDark ? 'bg-slate-950' : 'bg-white',
    border: isDark ? 'border-slate-800' : 'border-zinc-200',
    // Header / footer dividers
    divider: isDark ? 'border-slate-800/80' : 'border-zinc-200',
    // Header text
    title: isDark ? 'text-white' : 'text-slate-900',
    subtitle: isDark ? 'text-slate-500' : 'text-slate-400',
    // Icon buttons (reset / close)
    iconBtn: isDark
      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
      : 'bg-zinc-100 border-zinc-200 text-slate-500 hover:text-slate-900 hover:bg-zinc-200',
    // Preview ring offset
    ringOffset: isDark ? 'ring-offset-slate-950' : 'ring-offset-white',
    previewBg: isDark ? 'bg-slate-800' : 'bg-zinc-200',
    // Canvas area background
    canvasBg: isDark ? '#080c14' : '#f1f5f9',
    dotColor: isDark ? '#334155' : '#cbd5e1',
    // Loading / error text
    loadingText: isDark ? 'text-slate-500' : 'text-slate-400',
    // Drag hint pill
    hintBg: isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-zinc-300',
    hintText: isDark ? 'text-slate-400' : 'text-slate-500',
    // Controls panel
    panelBg: isDark ? '' : 'bg-zinc-50',
    // Tab bar
    tabActive: isDark
      ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
      : 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50',
    tabInactive: isDark
      ? 'text-slate-500 hover:text-slate-300'
      : 'text-slate-400 hover:text-slate-700',
    // Slider track
    sliderTrack: isDark ? 'bg-slate-800' : 'bg-zinc-200',
    sliderLabel: isDark ? 'text-slate-400' : 'text-slate-500',
    sliderHint: isDark ? 'text-slate-600' : 'text-slate-400',
    // Control buttons (zoom/rotate)
    ctrlBtn: isDark
      ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
      : 'bg-zinc-100 border-zinc-200 text-slate-500 hover:text-slate-900 hover:bg-zinc-200',
    // Flip / toggle buttons
    flipOff: isDark
      ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      : 'bg-zinc-100 border-zinc-200 text-slate-500 hover:bg-zinc-200 hover:text-slate-800',
    flipOn: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-500',
    // Reset adjustments button
    resetBtn: isDark
      ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
      : 'bg-zinc-100 border-zinc-200 text-slate-500 hover:text-slate-800 hover:bg-zinc-200',
    // Cancel button
    cancelBtn: isDark
      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
      : 'bg-zinc-100 border-zinc-200 text-slate-700 hover:text-slate-900 hover:bg-zinc-200',
    // Error close button
    errBtn: isDark
      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
      : 'bg-zinc-100 border-zinc-200 text-slate-600 hover:bg-zinc-200',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4"
          style={{ zIndex: 9999, background: isDark ? 'rgba(0,0,0,0.82)' : 'rgba(15,23,42,0.55)' }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-full sm:max-w-lg ${t.bg} border-t sm:border ${t.border} rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col`}
            style={{ maxHeight: '95dvh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient glow */}
            <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl pointer-events-none ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-400/8'}`} />

            {/* ── Header ── (fixed, never scrolls) */}
            <div className={`flex-shrink-0 flex items-center justify-between px-4 py-3 border-b ${t.divider}`}>
              <div className="flex items-center gap-2.5">
                {/* Live preview */}
                <div className={`relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-500/40 ring-offset-1 ${t.ringOffset} flex-shrink-0 ${t.previewBg}`}>
                  <canvas ref={previewCanvasRef} className="w-full h-full object-cover" />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-tight ${t.title}`}>Photo Editor</h3>
                  <p className={`text-[9px] font-mono uppercase tracking-widest ${t.subtitle}`}>Drag · Zoom · Adjust</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReset}
                  title="Reset all"
                  className={`p-1.5 rounded-lg border transition-all active:scale-90 ${t.iconBtn}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onCancel}
                  className={`p-1.5 rounded-lg border transition-all active:scale-90 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 ${t.iconBtn}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Canvas area ── (fixed height, never scrolls) */}
            <div
              className="flex-shrink-0 relative flex items-center justify-center"
              style={{ background: t.canvasBg }}
            >
              {/* Dot grid */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle, ${t.dotColor} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {isLoading ? (
                <div className="flex flex-col items-center gap-3 py-10 relative z-10">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  <p className={`text-xs font-mono uppercase tracking-widest ${t.loadingText}`}>Loading...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-3 py-10 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-sm text-red-400 font-mono text-center px-4">{error}</p>
                  <button
                    onClick={onCancel}
                    className={`px-4 py-1.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${t.errBtn}`}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="relative p-2 flex items-center justify-center w-full">
                  <canvas
                    ref={canvasRef}
                    className={`rounded-xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{
                      width: canvasSize,
                      height: canvasSize,
                      maxWidth: '100%',
                      touchAction: 'none',
                      display: 'block',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                  />
                  {!isDragging && (
                    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm rounded-full border ${t.hintBg}`}>
                      <Move className={`w-2.5 h-2.5 ${t.hintText}`} />
                      <span className={`text-[9px] font-mono whitespace-nowrap ${t.hintText}`}>Drag to reposition</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Controls ── (scrollable on small screens) */}
            {!isLoading && !error && (
              <div className={`flex-1 flex flex-col min-h-0 border-t ${t.divider} ${t.panelBg}`}>

                {/* Tab switcher */}
                <div className={`flex-shrink-0 flex border-b ${t.divider}`}>
                  {(['transform', 'adjust'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? t.tabActive : t.tabInactive
                        }`}
                    >
                      {tab === 'transform' ? '⚙ Transform' : '✦ Adjust'}
                    </button>
                  ))}
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <div className="p-3 space-y-3">

                    {/* ── Transform tab ── */}
                    {activeTab === 'transform' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

                        {/* Zoom */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <ZoomIn className={`w-3 h-3 ${t.sliderLabel}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${t.sliderLabel}`}>Zoom</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-500 font-mono">{Math.round(scale * 100)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleZoom(-0.1)} className={`p-1.5 rounded-lg border transition-all active:scale-90 flex-shrink-0 ${t.ctrlBtn}`}>
                              <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <div className={`relative flex-1 h-2 rounded-full cursor-pointer ${t.sliderTrack}`}>
                              <div
                                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                style={{ width: `${((scale - 0.3) / (4 - 0.3)) * 100}%` }}
                              />
                              <input
                                type="range" min={30} max={400} step={1}
                                value={Math.round(scale * 100)}
                                onChange={e => setScale(Number(e.target.value) / 100)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ zIndex: 10 }}
                              />
                            </div>
                            <button onClick={() => handleZoom(0.1)} className={`p-1.5 rounded-lg border transition-all active:scale-90 flex-shrink-0 ${t.ctrlBtn}`}>
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Rotation */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <RotateCw className={`w-3 h-3 ${t.sliderLabel}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${t.sliderLabel}`}>Rotation</span>
                            </div>
                            <span className="text-[10px] font-black text-violet-500 font-mono">{rotation}°</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={handleRotateCCW} className={`p-1.5 rounded-lg border transition-all active:scale-90 flex-shrink-0 ${t.ctrlBtn}`}>
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <div className={`relative flex-1 h-2 rounded-full cursor-pointer ${t.sliderTrack}`}>
                              <div
                                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                                style={{ width: `${(rotation / 360) * 100}%` }}
                              />
                              <input
                                type="range" min={0} max={360} step={1}
                                value={rotation}
                                onChange={e => setRotation(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                style={{ zIndex: 10 }}
                              />
                            </div>
                            <button onClick={handleRotateCW} className={`p-1.5 rounded-lg border transition-all active:scale-90 flex-shrink-0 ${t.ctrlBtn}`}>
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Flip */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFlipH(v => !v)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${flipH ? t.flipOn : t.flipOff}`}
                          >
                            <FlipHorizontal className="w-3.5 h-3.5" />
                            Flip H
                          </button>
                          <button
                            onClick={() => setFlipV(v => !v)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${flipV ? t.flipOn : t.flipOff}`}
                          >
                            <FlipVertical className="w-3.5 h-3.5" />
                            Flip V
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Adjust tab ── */}
                    {activeTab === 'adjust' && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

                        {/* Brightness */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Sun className={`w-3 h-3 ${t.sliderLabel}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${t.sliderLabel}`}>Brightness</span>
                            </div>
                            <span className="text-[10px] font-black text-amber-500 font-mono">{brightness}%</span>
                          </div>
                          <div className={`relative h-2 rounded-full cursor-pointer ${t.sliderTrack}`}>
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                              style={{ width: `${((brightness - 50) / (200 - 50)) * 100}%` }}
                            />
                            <input
                              type="range" min={50} max={200} step={1}
                              value={brightness}
                              onChange={e => setBrightness(Number(e.target.value))}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              style={{ zIndex: 10 }}
                            />
                          </div>
                          <div className={`flex justify-between text-[9px] font-mono ${t.sliderHint}`}>
                            <span>Dark</span><span>Normal</span><span>Bright</span>
                          </div>
                        </div>

                        {/* Contrast */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Contrast className={`w-3 h-3 ${t.sliderLabel}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${t.sliderLabel}`}>Contrast</span>
                            </div>
                            <span className="text-[10px] font-black text-cyan-500 font-mono">{contrast}%</span>
                          </div>
                          <div className={`relative h-2 rounded-full cursor-pointer ${t.sliderTrack}`}>
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-700 to-cyan-400"
                              style={{ width: `${((contrast - 50) / (200 - 50)) * 100}%` }}
                            />
                            <input
                              type="range" min={50} max={200} step={1}
                              value={contrast}
                              onChange={e => setContrast(Number(e.target.value))}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              style={{ zIndex: 10 }}
                            />
                          </div>
                          <div className={`flex justify-between text-[9px] font-mono ${t.sliderHint}`}>
                            <span>Flat</span><span>Normal</span><span>Vivid</span>
                          </div>
                        </div>

                        {/* Reset adjustments */}
                        <button
                          onClick={() => { setBrightness(100); setContrast(100) }}
                          className={`w-full py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${t.resetBtn}`}
                        >
                          Reset Adjustments
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* ── Action buttons ── (always visible at bottom) */}
                <div className={`flex-shrink-0 flex gap-2 px-3 py-3 border-t ${t.divider}`}>
                  <button
                    onClick={onCancel}
                    className={`flex-1 py-2.5 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${t.cancelBtn}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Apply Changes
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}