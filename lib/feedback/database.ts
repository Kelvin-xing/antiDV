import 'server-only'
import { Pool } from 'pg'

let pool: Pool | undefined
export function feedbackDatabase() {
  // Must point to the same PostgreSQL database as account_server.py. No old Neon fallback.
  const connectionString = process.env.CHATFLOW_DATABASE_URL
  if (!connectionString) { throw new Error('Chatflow database is not configured') }
  pool ??= new Pool({ connectionString, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000, statement_timeout: 10000 })
  return pool
}
