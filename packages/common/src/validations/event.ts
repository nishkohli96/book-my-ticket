import { z } from 'zod';
import { EventCategory } from '@/types';

export const eventListQuerySchema = z.object({
  category: z.enum(EventCategory).optional(),
  city: z.string().trim().min(1).optional(),
  /** Free-text search over event and venue name. */
  q: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

export type EventListQuery = z.infer<typeof eventListQuerySchema>;
