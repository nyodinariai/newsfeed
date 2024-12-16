import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams} = new URL(req.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)
  const offset = (page - 1) * limit;
  const category = searchParams.get('category')
  
  try {
    // Parse the query parameters
    

    if (!category) {
      return new Response(JSON.stringify({ error: "Category is required" }), {
        status: 400,
      });
    }

    // Fetch news from the Supabase database
    const { data: news, error } = await supabase
      .from("news") // Adjust to your table name
      .select("*")
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .eq("category", category);

    if (error) {
      console.error("Supabase error:", error.message);
      return new Response(
        JSON.stringify({ error: "Error fetching news from database" }),
        { status: 500 }
      );
    }

    if (!news || news.length === 0) {
      return new Response(
        JSON.stringify({ message: `No news found for category: ${category}` }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ news }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching news:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}