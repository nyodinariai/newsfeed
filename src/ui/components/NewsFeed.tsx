'use client'

import { useGetNews } from "@/data/hooks/useGetNews"
import { useEffect, useRef, useCallback } from "react"
import NewsItem from "./NewsItem" 
import { Skeleton } from "@/components/ui/skeleton"

export function NewsFeed() {
  const { news, fetchMore, loading, hasMore } = useGetNews()
  const observer = useRef<IntersectionObserver | null>(null)

  const lastNewsItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, fetchMore])

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <div key={item.id} ref={index === news.length - 1 ? lastNewsItemRef : null}>
            <NewsItem
              title={item.title}
              description={item.description}
              url={item.url}
              source={item.source}
              published_at={item.published_at}
            />
          </div>
        ))}
      </div>
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      )}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-8">No more news to load.</p>
      )}
    </div>
  )
}

export default NewsFeed