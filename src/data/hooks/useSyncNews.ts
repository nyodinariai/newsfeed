import { supabase } from "@/lib/supabase";

interface News{
    id?: number;
    title: string;
    description: string;
    url: string;
    source: string;
    published_at: string;
    category: string;
}

export const useSyncNews = () => {

    const syncNewsWithDatabase = async (category: string | null): Promise<void> => {
        try {
            const response = await fetch(
                category === "business" || category === "science" || category === "technology"
                ? `/api/fetch-news?category=${category}&limit=10`
                :`/api/fetch-news-by?category=${category}&limit=10`
            ,{method: "POST"});
            if(!response.ok){
                throw new Error("Failed to fetch news.")
            }

            const {news: fetchedNews } = await response.json()

            console.log("fetched news:", fetchedNews)
            for (const newsItem of fetchedNews ){
                const { data: existingNews } = await supabase
                .from("news")
                .select("id")
                .eq("title", newsItem.title)
                .eq("category", newsItem.category)
                .maybeSingle();

            if(!existingNews){
                await supabase.from("news").insert({
                    title: newsItem.title,
                    description: newsItem.description,
                    url: newsItem.url,
                    source: newsItem.source,
                    published_at: newsItem.published_at,
                    category: newsItem.category, 
                })
            }
            }
        } catch (error) {
            console.log("Erro ao sincronizar com o Supabase", error)
        }
    } 

    return { syncNewsWithDatabase }
}