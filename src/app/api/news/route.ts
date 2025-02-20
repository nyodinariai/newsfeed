import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const offset = (page - 1) * limit;
  const category = searchParams.get("category")
  

  try {
    const {data, error} = await supabase
    .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });

  }  catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}