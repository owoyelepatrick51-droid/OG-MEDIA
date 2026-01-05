import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

import Parser from "rss-parser";

const parser = new Parser();

// Using ok.surf news-feed API which updates frequently (every few minutes)
const NEWS_CACHE_TTL = 1 * 60 * 1000; // 1 minute cache
let newsCache: { data: any; timestamp: number } | null = null;

// Nigeria Trending RSS Feeds
const NIGERIA_FEEDS = {
  trending: "https://premiumtimesng.com/feed",
  entertainment: "https://gistlover.com/category/entertainment/feed",
  music: "https://notjustok.com/feed",
  sports: "https://vanguardngr.com/category/sports/feed",
  celebrity: "https://www.gistlover.com/category/gist/feed",
  music_updates: "https://tooxclusive.com/feed",
};

async function fetchNigeriaTrending(category: keyof typeof NIGERIA_FEEDS = 'trending') {
  try {
    const feed = await parser.parseURL(NIGERIA_FEEDS[category]);
    return feed.items.map(item => ({
      title: item.title,
      url: item.link,
      urlToImage: extractImage(item),
      source: { name: "OG Nigeria" },
      publishedAt: item.pubDate || new Date().toISOString(),
      description: item.contentSnippet || item.title
    })).slice(0, 10);
  } catch (e) {
    console.error(`Nigeria feed error (${category}):`, e);
    return [];
  }
}

function extractImage(item: any) {
  // Try to find image in enclosure
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;

  // Check for media:content or media:thumbnail (common in RSS)
  const mediaContent = item['media:content'] || item['media:thumbnail'];
  if (mediaContent && mediaContent.$ && mediaContent.$.url) return mediaContent.$.url;

  // Try to find image in content:encoded or content
  const content = item['content:encoded'] || item.content || "";
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function fetchNews(category?: string, query?: string) {
  // Handle Nigerian categories separately via RSS
  if (category?.startsWith('nigeria_')) {
    const subCat = category.split('_')[1] as keyof typeof NIGERIA_FEEDS;
    return fetchNigeriaTrending(subCat);
  }

  // Check cache first to avoid hitting API too frequently while ensuring freshness
  const now = Date.now();
  if (newsCache && (now - newsCache.timestamp < NEWS_CACHE_TTL)) {
    // Return from cache
    return formatNewsData(newsCache.data, category);
  }

  try {
    const res = await fetch('https://ok.surf/api/v1/cors/news-feed');
    const data = await res.json();
    
    // Update cache
    newsCache = { data, timestamp: now };
    
    return formatNewsData(data, category);
  } catch (e) {
    console.error("News fetch error:", e);
    // Return cached data even if expired if API fails, or empty array
    if (newsCache) return formatNewsData(newsCache.data, category);
    return [];
  }
}

function formatNewsData(data: any, category?: string) {
  const categoriesMap: Record<string, string> = {
    'business': 'Business',
    'entertainment': 'Entertainment',
    'health': 'Health',
    'science': 'Science',
    'sports': 'Sports',
    'technology': 'Technology',
    'tech': 'Technology',
    'world': 'World',
    'nigeria': 'World', 
    'crypto': 'Business',
  };

  const targetCat = category ? (categoriesMap[category.toLowerCase()] || 'World') : 'World';
  const articles = data[targetCat] || data['World'] || [];

  return articles.map((a: any) => ({
    title: a.title,
    url: a.link,
    urlToImage: a.og || a.image,
    source: { name: a.source },
    publishedAt: new Date().toISOString(), 
    description: a.title
  }));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === AUTH SETUP ===
  // Initialize storage with session store
  const sessionSettings = {
    cookie: { maxAge: 86400000 },
    store: new SessionStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "secret",
  };
  
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) { // In production use bcrypt
        return done(null, false, { message: "Invalid credentials" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Init storage with session store
  storage.sessionStore = sessionSettings.store;


  // === AUTH ROUTES ===
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) return res.status(400).json({ message: "Username exists" });
      
      const user = await storage.createUser(input);
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        next(err);
      }
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // === NEWS ROUTES ===
  app.get(api.news.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const q = req.query.q as string | undefined;
    const news = await fetchNews(category, q);
    res.json(news);
  });

  app.get(api.news.trending.path, async (req, res) => {
    // Return a mix of global trending and Nigeria trending for the home page
    const globalNews = await fetchNews();
    const nigeriaNews = await fetchNews('nigeria_trending');
    const combined = [...nigeriaNews.slice(0, 3), ...globalNews.slice(0, 5)];
    res.json(combined);
  });

  // === BOOKMARKS ROUTES ===
  app.get(api.bookmarks.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bookmarks = await storage.getBookmarks((req.user as any).id);
    res.json(bookmarks);
  });

  app.post(api.bookmarks.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.bookmarks.create.input.parse(req.body);
    const bookmark = await storage.createBookmark((req.user as any).id, input);
    res.status(201).json(bookmark);
  });

  app.delete(api.bookmarks.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteBookmark(Number(req.params.id), (req.user as any).id);
    res.sendStatus(200);
  });

  return httpServer;
}
