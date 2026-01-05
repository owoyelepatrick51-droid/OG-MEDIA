import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Share2, Bookmark as BookmarkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Article {
  title: string;
  url: string;
  urlToImage?: string | null;
  source: { name: string };
  publishedAt: string;
  description?: string | null;
}

interface NewsCardProps {
  article: Article;
  layout?: "grid" | "list";
  priority?: boolean;
}

export function NewsCard({ article, layout = "grid", priority = false }: NewsCardProps) {
  const { addBookmark, removeBookmark, isBookmarked, getBookmarkId } = useBookmarks();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const isSaved = isBookmarked(article.url);
  const bookmarkId = getBookmarkId(article.url);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login required", description: "Create an account to save articles." });
      setLocation("/auth");
      return;
    }

    if (isSaved && bookmarkId) {
      removeBookmark.mutate(bookmarkId);
    } else {
      addBookmark.mutate({
        title: article.title,
        url: article.url,
        urlToImage: article.urlToImage || null,
        sourceName: article.source.name,
        publishedAt: article.publishedAt,
        description: article.description || null,
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description || article.title,
          url: article.url,
        });
      } catch (err) {
        // Share cancelled or failed silently
      }
    } else {
      await navigator.clipboard.writeText(article.url);
      toast({ title: "Copied!", description: "Link copied to clipboard." });
    }
  };

  // Safe date parsing
  let dateDisplay = "";
  try {
    dateDisplay = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  } catch (e) {
    dateDisplay = "Recently";
  }

  // Fallback image logic: Use a more varied set of fallbacks based on the article title to avoid the same image
  const fallbackImages = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1504462385559-c4e530cf0017?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?w=800&auto=format&fit=crop&q=60"
  ];
  const fallbackIndex = Math.abs(article.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % fallbackImages.length;
  const imageSrc = article.urlToImage || fallbackImages[fallbackIndex];

  if (layout === "list") {
    return (
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="group relative flex gap-4 p-4 rounded-xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50"
      >
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
          <img 
            src={imageSrc} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60"; // Generic news fallback
            }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                {article.source.name}
              </span>
              <span className="text-xs text-muted-foreground">{dateDisplay}</span>
            </div>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
              <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                {article.description}
              </p>
            </a>
          </div>
          <div className="flex items-center justify-end gap-1 mt-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className={`h-8 w-8 ${isSaved ? "text-primary fill-primary" : "text-muted-foreground hover:text-primary"}`}
              onClick={handleBookmark}
            >
              <BookmarkIcon className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </motion.article>
    );
  }

  // Grid Layout
  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img 
          src={imageSrc} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          onError={(e) => {
             e.currentTarget.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60"; // Newspaper fallback
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
          {article.source.name}
        </span>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <span>{dateDisplay}</span>
        </div>
        
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block focus:outline-none flex-1">
          <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {article.description}
          </p>
        </a>

        <div className="flex items-center justify-between pt-4 border-t mt-auto">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold flex items-center hover:underline"
          >
            Read More <ExternalLink className="ml-1 h-3 w-3" />
          </a>
          <div className="flex gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className={`h-8 w-8 rounded-full hover:bg-muted ${isSaved ? "text-primary" : ""}`}
              onClick={handleBookmark}
            >
              <BookmarkIcon className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
