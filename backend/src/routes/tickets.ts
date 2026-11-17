import { FastifyInstance } from 'fastify'
import { requireApiKey } from '../middleware/apiKey'
import { createTicketSchema, updateTicketStatusSchema, ticketQuerySchema } from '../schemas/ticket'

export default async function ticketsRoutes(fastify: FastifyInstance) {

  // POST /tickets — public, called directly by the ticket form
  fastify.post('/', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async (request, reply) => {
    const parsed = createTicketSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid ticket data', details: parsed.error.flatten() })
    }

    try {
      const ticket = await fastify.prisma.ticket.create({ data: parsed.data })
      // Public endpoint: don't echo personal data back.
      return reply.status(201).send({ id: ticket.id, ticketId: ticket.ticketId, status: ticket.status })
    } catch (err) {
      if ((err as { code?: string }).code === 'P2002') {
        return reply.status(409).send({ error: 'Ticket id already exists' })
      }
      throw err
    }
  })

  // GET /tickets — protected, admin/history view
  fastify.get('/', { preHandler: [requireApiKey] }, async (request, reply) => {
    const parsed = ticketQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid query', details: parsed.error.flatten() })
    }

    const { category, status } = parsed.data
    const tickets = await fastify.prisma.ticket.findMany({
      where: { ...(category && { category }), ...(status && { status }) },
      orderBy: { createdAt: 'desc' },
    })
    return reply.send({ tickets })
  })

  // GET /tickets/:id — protected
  fastify.get<{ Params: { id: string } }>('/:id', { preHandler: [requireApiKey] }, async (request, reply) => {
    const ticket = await fastify.prisma.ticket.findUnique({ where: { id: request.params.id } })
    if (!ticket) return reply.status(404).send({ error: 'Ticket not found' })
    return reply.send(ticket)
  })

  // PATCH /tickets/:id — protected, status update only
  fastify.patch<{ Params: { id: string } }>('/:id', { preHandler: [requireApiKey] }, async (request, reply) => {
    const parsed = updateTicketStatusSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid status', details: parsed.error.flatten() })
    }

    try {
      const ticket = await fastify.prisma.ticket.update({
        where: { id: request.params.id },
        data: { status: parsed.data.status },
      })
      return reply.send(ticket)
    } catch (err) {
      if ((err as { code?: string }).code !== 'P2025') throw err
      return reply.status(404).send({ error: 'Ticket not found' })
    }
  })
}
