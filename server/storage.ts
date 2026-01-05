import { db } from "./db";
import { users, bookmarks, type User, type InsertUser, type Bookmark, type InsertBookmark } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBookmarks(userId: number): Promise<Bookmark[]>;
  createBookmark(userId: number, bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number, userId: number): Promise<void>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor(sessionStore: any) {
    this.sessionStore = sessionStore;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId)).orderBy(desc(bookmarks.createdAt));
  }

  async createBookmark(userId: number, insertBookmark: InsertBookmark): Promise<Bookmark> {
    const [bookmark] = await db.insert(bookmarks).values({ ...insertBookmark, userId }).returning();
    return bookmark;
  }

  async deleteBookmark(id: number, userId: number): Promise<void> {
    await db.delete(bookmarks).where(eq(bookmarks.id, id));
  }
}

export const storage = new DatabaseStorage(null);
