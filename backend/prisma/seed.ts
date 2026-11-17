import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Entirely invented demo data.
const day = (n: number) => new Date(Date.UTC(2025, 0, n, 9, 30))

const tickets = [
  { ticketId: 'AC-100001', category: 'Account', name: 'Alex Example', phone: '+1 555 010 0101', email: 'alex@example.com', address: 'Springfield, Exampleland', priority: 'High', issue: 'Cannot sign in after resetting my password; the reset link says it has expired.', status: 'open', createdAt: day(2) },
  { ticketId: 'BG-100002', category: 'Bug report', name: 'Sam Sample', phone: '+1 555 010 0102', email: 'sam@example.com', address: null, priority: 'Medium', issue: 'CSV export hangs at 80% when the project has more than 500 items.', status: 'in-progress', createdAt: day(4) },
  { ticketId: 'BL-100003', category: 'Billing', name: 'Jordan Demo', phone: '+1 555 010 0103', email: 'jordan@example.com', address: 'Metropolis, Exampleland', priority: 'Low', issue: 'Invoice 0042 shows a duplicate charge.', status: 'resolved', createdAt: day(6) },
  { ticketId: 'FR-100004', category: 'Feature request', name: 'Taylor Test', phone: '+1 555 010 0104', email: 'taylor@example.com', address: null, priority: 'Low', issue: 'Please add a dark mode option to the dashboard.', status: 'open', createdAt: day(9) },
  { ticketId: 'AC-100005', category: 'Account', name: 'Casey Placeholder', phone: '+1 555 010 0105', email: 'casey@example.com', address: null, priority: 'Low', issue: 'Need to transfer workspace ownership to a colleague.', status: 'in-progress', createdAt: day(11) },
  { ticketId: 'BL-100006', category: 'Billing', name: 'Riley Mock', phone: '+1 555 010 0106', email: 'riley@example.com', address: 'Gotham, Exampleland', priority: 'High', issue: 'Payment went through but the account still shows overdue.', status: 'open', createdAt: day(13) },
]

async function main() {
  for (const t of tickets) {
    await prisma.ticket.upsert({ where: { ticketId: t.ticketId }, update: {}, create: t })
  }
  console.log(`Seeded ${tickets.length} demo tickets`)
}

main().finally(() => prisma.$disconnect())
