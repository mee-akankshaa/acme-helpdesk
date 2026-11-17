import { z } from 'zod'

export const CATEGORIES = ['Account', 'Billing', 'Bug report', 'Feature request'] as const
export const STATUSES = ['open', 'in-progress', 'resolved'] as const

export const createTicketSchema = z.object({
  ticketId: z.string().regex(/^(AC|BL|BG|FR)-\d{6}$/, 'Invalid ticket id'),
  category: z.enum(CATEGORIES),
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(30).regex(/^[0-9+()\-. ]+$/, 'Invalid phone number'),
  email: z.string().trim().max(254).email(),
  address: z.string().trim().max(300).optional().nullable(),
  priority: z.enum(['Low', 'Medium', 'High']),
  issue: z.string().trim().min(1).max(5000),
})

export const updateTicketStatusSchema = z.object({
  status: z.enum(STATUSES),
})

export const ticketQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(STATUSES).optional(),
})
