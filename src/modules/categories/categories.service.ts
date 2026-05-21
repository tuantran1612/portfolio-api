import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { projects: true } } },
    })
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } },
    })
    if (!category) throw new NotFoundException(`Category ${id} not found`)
    return category
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    })
    if (existing) throw new ConflictException(`Slug "${dto.slug}" already exists`)

    return this.prisma.category.create({ data: dto })
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id)
    return this.prisma.category.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    const category = await this.findOne(id)
    if (category._count.projects > 0) {
      throw new ConflictException(
        `Cannot delete category with ${category._count.projects} projects`
      )
    }
    return this.prisma.category.delete({ where: { id } })
  }

  async seed() {
    const defaults = [
      { name: 'Frontend', slug: 'frontend' },
      { name: 'Backend', slug: 'backend' },
      { name: 'Fullstack', slug: 'fullstack' },
      { name: 'Mobile', slug: 'mobile' },
      { name: 'DevOps', slug: 'devops' },
    ]

    const results = await Promise.allSettled(
      defaults.map((cat) =>
        this.prisma.category.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        })
      )
    )

    return { message: 'Categories seeded', count: results.length }
  }
}