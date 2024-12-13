'use client'

import { useGetNews } from "@/data/hooks/useGetNews"
import { useEffect, useRef, useCallback, useState } from "react"
import NewsItem from "./NewsItem" 
import { Skeleton } from "@/ui/shadcn/components/ui/skeleton"
import { NavigationMenu } from "./header/NavigationMenu"

export function NewsFeed() {
    const [category, setCategory] = useState("")
    const [isFetching, setIsFetching] = useState(false)
    const { news, fetchMore, loading, hasMore, setNews } = useGetNews()
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

  const handleCategoryChange = async (newCategory: string) => {
    setCategory(newCategory);
    setIsFetching(true)
  
    try {

      let res;

      if(
        newCategory !== "business" && 
        newCategory !== "science" && 
        newCategory !== "technology" &&
        newCategory
      ){

        res = await fetch(`/api/fetch-news-by?category=${newCategory}`, {
          method: "POST",
        });
      } else{
        res = await fetch(`/api/fetch-news?category=${newCategory}`, {
          method: "POST",
        });
      } 
  
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
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {

  }, [news])

  const categories = [ "business", "science", "technology", "bitcoin", "brazil"];
  const menuItems = categories.map(cat => ({
    title: cat.charAt(0).toUpperCase() + cat.slice(1),
    action: () => handleCategoryChange(cat)
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Buttons */}
      <div className="mb-4">
        <NavigationMenu items={menuItems}/>
      </div>

      <div className="grid gap-6 grid-cols-1">
        {news.map((item, index) => (
          <div key={item.id} ref={index === news.length - 1 ? lastNewsItemRef : null}>
            <NewsItem
              title={item.title}
              description={item.description}
              url={item.url}
              source={item.source}
              published_at={item.published_at.split("T")[0].replaceAll("-", "/")}
              category={item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
            />
          </div>
        ))}
      </div>
  
      {loading && (
        <div className="grid gap-6 grid-cols-1 mt-6">
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