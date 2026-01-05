import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Menu, 
  X, 
  User, 
  Bookmark, 
  LogOut, 
  Newspaper,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const categories = [
  { name: "Naija Trending", path: "/category/nigeria_trending" },
  { name: "Naija Celebs", path: "/category/nigeria_entertainment" },
  { name: "Naija Music", path: "/category/nigeria_music" },
  { name: "Naija Sports", path: "/category/nigeria_sports" },
  { name: "World", path: "/category/general" },
  { name: "Business", path: "/category/business" },
  { name: "Tech", path: "/category/technology" },
  { name: "Science", path: "/category/science" },
  { name: "Health", path: "/category/health" },
  { name: "Sports", path: "/category/sports" },
  { name: "Entertainment", path: "/category/entertainment" },
  { name: "Crypto", path: "/category/crypto" },
];

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled ? "bg-background/95 backdrop-blur-md border-border/60 shadow-sm" : "bg-background border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative h-12 w-12 flex items-center justify-center bg-transparent">
                  <img src="/logo.png" alt="OG MEDIA" className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300 mix-blend-multiply dark:mix-blend-screen" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl tracking-tighter leading-none text-primary">OG</span>
                  <span className="font-display font-bold text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Media</span>
                </div>
              </Link>
            </div>

            {/* Desktop Categories */}
            <nav className="hidden md:flex items-center gap-6 overflow-x-auto hide-scrollbar max-w-xl mx-4">
              {categories.slice(0, 5).map((cat) => (
                <Link 
                  key={cat.path} 
                  href={cat.path}
                  className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                    location === cat.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center outline-none">
                  More
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {categories.slice(5).map((cat) => (
                    <DropdownMenuItem key={cat.path} asChild>
                      <Link href={cat.path}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="font-semibold cursor-default">
                      @{user.username}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/bookmarks" className="cursor-pointer flex items-center">
                        <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button size="sm" className="hidden sm:flex">Sign In</Button>
                  <Button size="icon" variant="ghost" className="sm:hidden">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="font-semibold text-sm text-muted-foreground mb-2 px-2">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat.path} 
                    href={cat.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location === cat.path 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              
              <div className="border-t my-4 pt-4">
                <Link 
                  href="/bookmarks" 
                  className="flex items-center px-3 py-2 text-sm font-medium hover:bg-muted rounded-md"
                >
                  <Bookmark className="mr-2 h-4 w-4" /> My Bookmarks
                </Link>
                {!user && (
                   <Link 
                   href="/auth" 
                   className="flex items-center px-3 py-2 text-sm font-medium hover:bg-muted rounded-md mt-2 text-primary"
                 >
                   <User className="mr-2 h-4 w-4" /> Sign In / Register
                 </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
