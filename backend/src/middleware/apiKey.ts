import { createHash, timingSafeEqual } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'

const digest = (v: string) => createHash('sha256').update(v).digest()

export async function requireApiKey(request: FastifyRequest, reply: FastifyReply) {
  const expected = process.env.SUPPORT_API_KEY
  const auth = request.headers.authorization ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''

  // Hash both sides so the comparison is constant-time regardless of length.
  if (!expected || !token || !timingSafeEqual(digest(token), digest(expected))) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}
