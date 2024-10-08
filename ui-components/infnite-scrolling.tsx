'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

// Custom hook for infinite scroll
const useInfiniteScroll = (callback: () => void) => {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        callback()
      }
    })
    if (node) observer.current.observe(node)
  }, [callback])

  return lastElementRef
}

// Simulated function to fetch images
const fetchImages = (page: number, perPage: number) => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      const newImages = Array.from({ length: perPage }, (_, i) => 
        `/placeholder.svg?height=${200 + Math.floor(Math.random() * 200)}&width=${300 + Math.floor(Math.random() * 200)}&text=Image ${page * perPage + i + 1}`
      )
      resolve(newImages)
    }, 1000) // Simulate network delay
  })
}

export default function InfiniteScrollGallery() {
  const [images, setImages] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadMoreImages = useCallback(async () => {
    if (loading) return
    setLoading(true)
    const newImages = await fetchImages(page, 10)
    setImages(prevImages => [...prevImages, ...newImages])
    setPage(prevPage => prevPage + 1)
    setLoading(false)
  }, [page, loading])

  const lastImageRef = useInfiniteScroll(loadMoreImages)

  useEffect(() => {
    loadMoreImages()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Infinite Scroll Image Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            ref={index === images.length - 1 ? lastImageRef : null}
            className="relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Gallery image ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
