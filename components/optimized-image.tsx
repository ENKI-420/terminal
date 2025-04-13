"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export default function OptimizedImage({ src, alt, fallbackSrc = "/placeholder.svg", ...props }: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  const handleError = () => {
    if (!error) {
      console.warn(`Image load error for: ${src}`)
      setImgSrc(fallbackSrc)
      setError(true)
    }
  }

  return (
    <>
      <Image src={imgSrc || "/placeholder.svg"} alt={alt} {...props} onError={handleError} />
      {error && <div className="text-xs text-red-500 mt-1">Failed to load image. Using fallback.</div>}
    </>
  )
}
