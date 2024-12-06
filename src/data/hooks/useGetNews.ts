import { useCallback, useEffect, useState } from "react";


interface News {
    id: number;
    title: string;
    description: string;
    url: string;
    source: string
    published_at: string;
}

interface UseNewsResult{
    news: News[];
    fetchMore: () => void;
    loading: boolean;
    hasMore: boolean;
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

    return { news, fetchMore, loading, hasMore}
}