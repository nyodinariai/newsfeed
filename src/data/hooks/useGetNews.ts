import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

interface News {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  category: string;
}

interface UseNewsResult {
  news: News[];
  fetchMore: () => void;
  loading: boolean;
  hasMore: boolean;
  setNews: React.Dispatch<React.SetStateAction<News[]>>;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useGetNews = (): UseNewsResult => {
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(
    async (currentPage: number, currentCategory: string | null) => {
      setLoading(true);
      try {
        let response;
  
        if (!currentCategory) {
          response = await fetch(`/api/fetch-all-news?page=${currentPage}&limit=10`);
        } else if (["business", "science", "technology"].includes(currentCategory)) {
          response = await fetch(
            `/api/fetch-news?category=${currentCategory}&page=${currentPage}&limit=10`,
            { method: "POST" }
          );
        } else {
          response = await fetch(
            `/api/fetch-news-by?category=${currentCategory}&page=${currentPage}&limit=10`,
            { method: "POST" }
          );
        }
  
        if (!response.ok) {
          throw new Error("Failed to fetch news.");
        }

        const responseJson = await response.json();
console.log("API Response JSON:", responseJson);
  
        const { news: data } = await response.json();
  
        // Ensure the fetched data is an array
        if (Array.isArray(data)) {
          setNews((prev) => (currentPage === 1 ? data : [...prev, ...data]));
          setHasMore(data.length > 0); // Use the fetched data's length, not the state
        } else {
          console.error("Fetched data is not an array:", data);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (category) {
      setPage(1); // Reset to the first page when the category changes
      fetchNews(1, category);
    }
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page, category);
    }
  }, [page, category]);

  const fetchMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const subscription = supabase
      .channel("news")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "news" },
        (payload) => {
          const newArticle = payload.new as News;
          setNews((prev) => (Array.isArray(prev) ? [newArticle, ...prev] : [newArticle]));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { news, fetchMore, loading, hasMore, setNews, setCategory };
};