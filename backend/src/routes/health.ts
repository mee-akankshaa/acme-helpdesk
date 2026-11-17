import { FastifyInstance } from 'fastify'

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ ok: true })
  })
}
