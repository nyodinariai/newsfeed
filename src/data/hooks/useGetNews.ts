import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";


interface News {
    id: number;
    title: string;
    description: string;
    url: string;
    source: string
    published_at: string;
    category: string
}

interface UseNewsResult{
    news: News[];
    fetchMore: () => void;
    loading: boolean;
    hasMore: boolean;
    setNews: React.Dispatch<React.SetStateAction<News[]>>;
}


export const useGetNews = (): UseNewsResult => {
    const [news, setNews] = useState<News[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchNews = useCallback(async (currentPage: number) => {
        try {
            const response = await fetch(`/api/news?page=${currentPage}&limit=10`)
            const data: News[] = await response.json()
        
            setNews((prev) => [...prev, ...data]);
            setHasMore(data.length > 0);
        } catch (error){
            console.error('Error fetching news:', error)
        }
        setLoading(false)
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchNews(page)
    }, [page, fetchNews])

    const fetchMore = useCallback(() => {
        if(!loading && hasMore){
            setPage((prev) => prev + 1)
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
              setNews((prev) => [newArticle, ...prev]);
            }
          )
          .subscribe();
    
        return () => {
          supabase.removeChannel(subscription);
        };
      }, []);

    return { news, fetchMore, loading, hasMore, setNews}
}