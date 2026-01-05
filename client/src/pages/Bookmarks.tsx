import { useBookmarks } from "@/hooks/use-bookmarks";
import { NewsCard } from "@/components/NewsCard";
import { Loader2, Bookmark as BookmarkIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Bookmarks() {
  const { user, isLoading: authLoading } = useAuth();
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks();

  if (authLoading || (user && bookmarksLoading)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 px-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookmarkIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display font-bold text-3xl mb-4">Save stories for later</h1>
        <p className="text-muted-foreground mb-8">
          Create an account to bookmark articles and read them across all your devices.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg" className="w-full sm:w-auto">Sign In / Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl">My Bookmarks</h1>
          <p className="text-muted-foreground mt-2">
            {bookmarks?.length || 0} saved articles
          </p>
        </div>
      </header>

      {bookmarks && bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarks.map((bookmark) => (
            <NewsCard 
              key={bookmark.id} 
              article={{
                title: bookmark.title,
                url: bookmark.url,
                urlToImage: bookmark.urlToImage,
                source: { name: bookmark.sourceName || "Unknown" },
                publishedAt: bookmark.publishedAt || new Date().toISOString(),
                description: bookmark.description
              }} 
              layout="grid" 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 border-2 border-dashed rounded-2xl bg-muted/20">
          <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6">Articles you save will appear here.</p>
          <Link href="/">
            <Button variant="outline">Browse News</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
