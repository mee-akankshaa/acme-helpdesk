import { buildApp } from './app'

const start = async () => {
  if (!process.env.SUPPORT_API_KEY || process.env.SUPPORT_API_KEY === 'change-me') {
    console.warn('WARNING: SUPPORT_API_KEY is unset or the default; set a strong secret.')
  }
  const app = buildApp()
  try {
    const port = Number(process.env.PORT ?? 4100)
    await app.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
