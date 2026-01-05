import { useRoute } from "wouter";
import { useNews } from "@/hooks/use-news";
import { NewsCard } from "@/components/NewsCard";
import { Loader2 } from "lucide-react";

const categoryTitles: Record<string, string> = {
  general: "World News",
  business: "Business & Finance",
  technology: "Technology",
  science: "Science",
  health: "Health & Wellness",
  sports: "Sports",
  entertainment: "Entertainment",
  crypto: "Cryptocurrency",
  nigeria: "Nigeria News"
};

export default function Category() {
  const [match, params] = useRoute("/category/:category");
  const categorySlug = match ? params.category : "general";
  const title = categoryTitles[categorySlug] || "News";

  const { data: articles, isLoading, error } = useNews(categorySlug);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-muted-foreground mb-4">Failed to load news for this category.</p>
        <button onClick={() => window.location.reload()} className="text-primary hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 border-b pb-4">
        <span className="text-sm font-bold text-primary tracking-wider uppercase">Category</span>
        <h1 className="font-display font-black text-4xl md:text-5xl mt-2">{title}</h1>
      </header>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <NewsCard key={idx} article={article} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          No articles found in this category right now.
        </div>
      )}
    </div>
  );
}
