import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBookmark } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useBookmarks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: [api.bookmarks.list.path],
    queryFn: async () => {
      const res = await fetch(api.bookmarks.list.path);
      if (res.status === 401) return []; // No bookmarks if not logged in
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return api.bookmarks.list.responses[200].parse(await res.json());
    },
  });

  const addBookmark = useMutation({
    mutationFn: async (bookmark: InsertBookmark) => {
      const res = await fetch(api.bookmarks.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark),
      });
      if (res.status === 401) throw new Error("Please login to save bookmarks");
      if (!res.ok) throw new Error("Failed to save bookmark");
      return api.bookmarks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookmarks.list.path] });
      toast({ title: "Saved", description: "Article added to your bookmarks" });
    },
    onError: (err) => {
      toast({ 
        title: "Error", 
        description: err instanceof Error ? err.message : "Failed to save", 
        variant: "destructive" 
      });
    },
  });

  const removeBookmark = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.bookmarks.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove bookmark");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookmarks.list.path] });
      toast({ title: "Removed", description: "Article removed from bookmarks" });
    },
    onError: (err) => {
      toast({ 
        title: "Error", 
        description: "Failed to remove bookmark", 
        variant: "destructive" 
      });
    },
  });

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked: (url: string) => bookmarks?.some((b) => b.url === url) ?? false,
    getBookmarkId: (url: string) => bookmarks?.find((b) => b.url === url)?.id,
  };
}
