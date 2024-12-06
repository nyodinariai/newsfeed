import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { NewsArticle } from "../fetch-news/route";



export async function GET() {
    const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY!;
    const category= "business";
    const country = "us"
    const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${NEWS_API_KEY}`);
    const { articles } = await response.json()

    if(!articles || articles.length === 0) {
        return NextResponse.json({message: 'No articles found.'})
    }
    const newsData = articles.map((article: NewsArticle) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        published_at: article.publishedAt,
      }));
    
      const { error } = await supabase.from('news').upsert(newsData);
    
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    
      return NextResponse.json({ message: `Fetched and saved ${articles.length} articles.` });
}
