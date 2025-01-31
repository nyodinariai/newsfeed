"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import NewsItem from "./NewsItem";
import { Skeleton } from "@/ui/shadcn/components/ui/skeleton";
import { NavigationMenu } from "./header/NavigationMenu";
import { useNews } from "@/data/hooks/useNews";

export function NewsFeed() {
  const [isFetching, setIsFetching] = useState(false);
  const { news, loadMoreNews, loading, hasMore, setCategory, resetNews } = useNews();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNewsItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNews(); // Certifique-se de que esta função atualiza o estado corretamente
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore,isFetching, loadMoreNews]
  );

  const handleCategoryChange = async (newCategory: string) => {
    setIsFetching(true);
    resetNews()
    setCategory(newCategory);

    

    try {
      await loadMoreNews();
    } catch (error) {

      throw new Error("Erro ao buscar notícias da categoria:");
    } finally {
      setIsFetching(false);
    }
  };

  const categories = ["business", "science", "technology", "bitcoin", "brazil", "sports"];
  const menuItems = categories.map((cat) => ({
    title: cat.charAt(0).toUpperCase() + cat.slice(1),
    action: () => handleCategoryChange(cat),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <NavigationMenu items={menuItems} />
      </div>

      <div className="grid gap-6 grid-cols-1">
        {Array.isArray(news) &&
          news.map((item, index) => (
            <div key={item.id} ref={index === news.length - 1 ? lastNewsItemRef : null}>
              <NewsItem
                title={item.title}
                description={item.description}
                url={item.url}
                source={item.source}
                published_at={item.published_at
                  .split("T")[0]
                  .replaceAll("-", "/")}
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

      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-8">
          Não há mais notícias para carregar.
        </p>
      )}

      {isFetching && (
        <div className="text-center text-gray-500 mt-4">Atualizando...</div>
      )}
    </div>
  );
}

export default NewsFeed;
