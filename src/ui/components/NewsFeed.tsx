'use client'

import { useGetNews } from "@/data/hooks/useGetNews"
import { useEffect, useRef, useCallback, useState } from "react"
import NewsItem from "./NewsItem" 
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { revalidateTag } from "next/cache"

export function NewsFeed() {
    const router = useRouter()
    const [category, setCategory] = useState("")
    const [isFetching, setIsFetching] = useState(false)
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


  const handleCategoryChange = async (newCategory: string) => {
    

    setCategory(newCategory);
    setIsFetching(true)
  
    try {
        const res = await fetch(`/api/fetch-news?category=${newCategory}`, {
          method: "POST",
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch news for the selected category.");
        }
  
      } catch (error) {
        console.error("Error fetching category news:", error);
      } finally{
        setIsFetching(false)
      }
  }

  useEffect(() => {

  }, [category])


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Buttons */}
      <div className="flex gap-4 mb-6">
        {[ "business", "science", "technology"].map(
          (cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded ${
                category === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          )
        )}
      </div>

      
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <div key={item.id} ref={index === news.length - 1 ? lastNewsItemRef : null}>
            <NewsItem
              title={item.title}
              description={item.description}
              url={item.url}
              source={item.source}
              published_at={item.published_at}
              category={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
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

      {isFetching && (
        <div className="text-center text-gray-500 mt-4">Atualizando...</div>
      )}
    </div>
  )
}

export default NewsFeed