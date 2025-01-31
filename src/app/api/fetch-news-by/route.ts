
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface Articles{
    title: string;
    description: string;
    url: string;
    source: {
        name: string
    };
    publishedAt: string;
    category: string;
    created_at: string
}


export async function POST(req: Request){

    try{
        const url = new URL(req.url)
        const category = url.searchParams.get("category");
        const language = "en"
        const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY!;

        const response = await fetch(`https://newsapi.org/v2/everything?q=${category}&language=${language}&apiKey=${NEWS_API_KEY}`);
    
        const { articles } = await response.json()


        if(!articles || articles.length === 0){
            return NextResponse.json({error: "No Articles found"})
        }

        const newsData = articles.map((article: Articles) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            published_at: article.publishedAt,
            category: category,
            created_at: new Date().toISOString()
        }))
        .filter(
            (article: Articles) => 
                article.title !== "[Removed]" && article.url !== "https://removed.com"
        );

        const {data: existingNews, error: fetchError} = await supabase
        .from("news")
        .select("title, url")

        if(fetchError){
            console.error("Error fetching exisiting news:", fetchError)
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

                 // Filter out duplicate news
    const newNews = newsData.filter(
        (article: Articles) =>
          !existingNews?.some(
            (existing) =>
              existing.title === article.title && existing.url === article.url
          )
      );
  
      if (newNews.length === 0) {
        return NextResponse.json({ message: "No new articles to save." });
      }


      console.log(newsData)
        const { error } = await supabase.from('news').upsert(newsData);
    
        if (error) {
            console.error('Supabase error', error)
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
        
          return NextResponse.json({ message: 'News fetched and saved successfully!', savedCount: newsData.length });

    }
    catch (error: any) {
        console.error('Fetch news error:', error);
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
      }
}