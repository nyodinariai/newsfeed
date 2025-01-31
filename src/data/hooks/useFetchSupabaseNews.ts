import { supabase } from "@/lib/supabase";
import { useState } from "react";


interface News{
    id: number;
    title: string;
    description: string | null;
    url: string;
    source: string | null;
    published_at: string;
    category: string | null;
}

export const useFetchSupabaseNews = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSupabaseNews = async (category: string | null, page: number): Promise<News[]> => {
        setLoading(true);

        try{
            const { data: fetchedNews, error} = await supabase
            .from("news")
            .select("*")
            .order("published_at", { ascending: false})
            .ilike("category", category || "%")
            .range((page - 1)* 10, page *10 -1)

            if (error){
                throw error;
            }

            setNews((prevNews) => [...prevNews, ...(fetchedNews ||[])])
            return fetchedNews || []
        } catch(error){
            console.error("Error fetching news from Supabase:", error);
            return []
        } finally{
            setLoading(false)
        }
    }

    const clearNews = () => setNews([]); // Função para limpar as notícias

return {news, fetchSupabaseNews, loading, clearNews, setNews}

}