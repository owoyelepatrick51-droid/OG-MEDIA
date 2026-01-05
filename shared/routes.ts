import { z } from 'zod';
import { insertUserSchema, insertBookmarkSchema, bookmarks, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      input: z.object({
        category: z.string().optional(),
        q: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.object({
          title: z.string(),
          url: z.string(),
          urlToImage: z.string().nullable().optional(),
          source: z.object({ name: z.string() }),
          publishedAt: z.string(),
          description: z.string().nullable().optional(),
        })),
      },
    },
    trending: {
      method: 'GET' as const,
      path: '/api/news/trending',
      responses: {
        200: z.array(z.object({
          title: z.string(),
          url: z.string(),
          urlToImage: z.string().nullable().optional(),
          source: z.object({ name: z.string() }),
          publishedAt: z.string(),
          description: z.string().nullable().optional(),
        })),
      },
    },
  },
  bookmarks: {
    list: {
      method: 'GET' as const,
      path: '/api/bookmarks',
      responses: {
        200: z.array(z.custom<typeof bookmarks.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/bookmarks',
      input: insertBookmarkSchema,
      responses: {
        201: z.custom<typeof bookmarks.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/bookmarks/:id',
      responses: {
        200: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
