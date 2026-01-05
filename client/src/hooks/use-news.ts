import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useNews(category?: string, query?: string) {
  return useQuery({
    queryKey: [api.news.list.path, category, query],
    queryFn: async () => {
      // Build query params
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (query) params.q = query;
      
      const queryString = new URLSearchParams(params).toString();
      const url = `${api.news.list.path}${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 401) return []; // Handle unauthorized gracefully
        throw new Error("Failed to fetch news");
      }
      const data = await res.json();
      return api.news.list.responses[200].parse(data);
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function useTrendingNews() {
  return useQuery({
    queryKey: [api.news.trending.path],
    queryFn: async () => {
      const res = await fetch(api.news.trending.path);
      if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error("Failed to fetch trending news");
      }
      const data = await res.json();
      return api.news.trending.responses[200].parse(data);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
