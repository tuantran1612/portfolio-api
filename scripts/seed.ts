import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'superadmin@portfolio.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123456'
  const name = process.env.ADMIN_NAME || 'Tuan Tran'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'admin' },
  })

  console.log(`Admin created: ${user.email}`)

  // seed default categories
  const categories = [
    { name: 'Frontend', slug: 'frontend' },
    { name: 'Backend', slug: 'backend' },
    { name: 'Fullstack', slug: 'fullstack' },
    { name: 'Mobile', slug: 'mobile' },
    { name: 'DevOps', slug: 'devops' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('Default categories seeded')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())