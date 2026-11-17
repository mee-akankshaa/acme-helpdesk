import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import prismaPlugin from './plugins/prisma'
import healthRoutes from './routes/health'
import ticketsRoutes from './routes/tickets'

export function buildApp() {
  const app = Fastify({
    bodyLimit: 32 * 1024,
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  })

  app.register(cors, {
    origin: (process.env.CORS_ORIGIN ?? '*').split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Per-IP limit; the public POST /tickets route sets a stricter one.
  app.register(rateLimit, { global: true, max: 120, timeWindow: '1 minute' })

  // Never leak internals: 4xx keep their message, everything else is generic.
  app.setErrorHandler((err, request, reply) => {
    const status = err.statusCode && err.statusCode >= 400 && err.statusCode < 500 ? err.statusCode : 500
    if (status === 500) request.log.error(err)
    reply.status(status).send({ error: status === 500 ? 'Internal error' : err.message })
  })

  app.register(prismaPlugin)

  app.register(healthRoutes)
  app.register(ticketsRoutes, { prefix: '/tickets' })

  return app
}
