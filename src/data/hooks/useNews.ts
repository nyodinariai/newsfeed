import { useCallback, useEffect, useState } from "react";
import { useFetchSupabaseNews } from "./useFetchSupabaseNews";
import { useSyncNews } from "./useSyncNews";

export const useNews = () => {
  const { syncNewsWithDatabase } = useSyncNews();
  const { news, fetchSupabaseNews, loading, clearNews, setNews } = useFetchSupabaseNews();

  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Estado para controlar a página atual
  const [hasMore, setHasMore] = useState(true); // Estado para indicar se há mais notícias para carregar

  const loadNews = useCallback(async () => {
    try {
      await syncNewsWithDatabase(category);
      const fetchedNews = await fetchSupabaseNews(category, page);
  
      if (fetchedNews.length === 0) {
        setHasMore(false);
      } else {
        setNews((prevNews) => {
          // Remover duplicados antes de adicionar novas notícias
          const uniqueNews = fetchedNews.filter(
            (newItem) => !prevNews.some((prev) => prev.id === newItem.id)
          );
          return [...prevNews, ...uniqueNews];
        });
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar notícias");
    }
  }, [category, page, syncNewsWithDatabase, fetchSupabaseNews]);

  useEffect(() => {
    setPage(1); // Resetar a página ao trocar de categoria
    setHasMore(true); // Resetar o estado de paginação
    clearNews()
    loadNews();
  }, [category]);

  const loadMoreNews = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Avançar para a próxima página
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      loadNews(); // Carregar mais notícias quando a página mudar
    }
  }, [page]);

  const resetNews = useCallback(() => {
    setPage(1);
    setHasMore(true);
    clearNews();
    loadNews()
  }, [loadNews, clearNews])

  return { news, loading, setCategory, loadMoreNews, hasMore, resetNews };
};