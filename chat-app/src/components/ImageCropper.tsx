import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, Check, ZoomIn, RotateCw } from 'lucide-react'
import getCroppedImg from '../utils/cropImage'

interface ImageCropperProps {
    imageSrc: string
    onCropComplete: (croppedImageBlob: Blob) => void
    onClose: () => void
}

export const ImageCropper = ({ imageSrc, onCropComplete, onClose }: ImageCropperProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    // args: (croppedArea, croppedAreaPixels)
    const onCropCompleteInternal = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = async () => {
        try {
            const croppedImage: any = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            onCropComplete(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-lg bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col h-[80vh] md:h-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Adjust Photo</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative flex-1 min-h-[300px] bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        classes={{
                            containerClassName: 'bg-black',
                            mediaClassName: ''
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="p-4 space-y-4 bg-zinc-900">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium uppercase tracking-wider">
                            <span className="flex items-center"><ZoomIn size={12} className="mr-1" /> Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium uppercase tracking-wider">
                            <span className="flex items-center"><RotateCw size={12} className="mr-1" /> Rotate</span>
                            <span>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    <div className="pt-2 flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={showCroppedImage}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <Check size={18} className="mr-2" />
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
