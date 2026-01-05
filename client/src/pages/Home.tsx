import { useTrendingNews, useNews } from "@/hooks/use-news";
import { NewsCard } from "@/components/NewsCard";
import { Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { data: trending, isLoading: trendingLoading } = useTrendingNews();
  const { data: latest, isLoading: latestLoading } = useNews("nigeria_trending");
  const { data: entertainment } = useNews("nigeria_entertainment");

  // Loading state
  if (trendingLoading || latestLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Curating your briefing...</p>
        </div>
      </div>
    );
  }

  // Hero Article (First trending item)
  const heroArticle = trending?.[0];
  const subHeroArticles = trending?.slice(1, 4);
  const latestArticles = latest?.slice(0, 9) || [];
  const entertainmentArticles = entertainment?.slice(0, 6) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Trending Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-primary/10 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl">Trending in Nigeria</h2>
        </div>

        {heroArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Main Hero Card */}
            <div className="lg:col-span-8">
              <NewsCard article={heroArticle} layout="grid" priority={true} />
            </div>
            
            {/* Sub Hero Side Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {subHeroArticles?.map((article, idx) => (
                <NewsCard key={idx} article={article} layout="list" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Entertainment & Gist */}
      {entertainmentArticles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary">Naija Gist & Entertainment</h2>
            <Link href="/category/nigeria_entertainment">
               <Button variant="ghost">View More</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entertainmentArticles.map((article, idx) => (
              <NewsCard key={idx} article={article} layout="grid" />
            ))}
          </div>
        </section>
      )}

      {/* Latest News Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl md:text-3xl">Latest News</h2>
          <Link href="/category/nigeria_trending">
             <Button variant="ghost">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article, idx) => (
            <NewsCard key={idx} article={article} layout="grid" />
          ))}
        </div>
      </section>
    </div>
  );
}
