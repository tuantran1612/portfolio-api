import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { RevalidateService } from '../../common/services/revalidate.service'
import { generateSlug } from '../../common/utils/slug.util'

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private revalidate: RevalidateService,
  ) {}

  findAll(categorySlug?: string, featured?: boolean) {
    return this.prisma.project.findMany({
      where: {
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(featured !== undefined && { featured }),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!project) throw new NotFoundException(`Project ${id} not found`)
    return project
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!project) throw new NotFoundException(`Project ${slug} not found`)
    return project
  }

  async create(dto: CreateProjectDto) {
    const baseSlug = dto.slug || generateSlug(dto.title)
    const slug = await this.resolveSlug(baseSlug)

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        content: dto.content,
        categoryId: dto.categoryId,
        techStack: dto.techStack,
        imageUrl: dto.imageUrl,
        liveUrl: dto.liveUrl,
        repoUrl: dto.repoUrl,
        featured: dto.featured ?? false,
      },
      include: { category: true },
    })

    await this.revalidate.revalidate('/', '/projects')
    return project
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.findOne(id)

    const slug = dto.slug
      ? await this.resolveSlug(dto.slug, id)
      : dto.title && dto.title !== existing.title
      ? await this.resolveSlug(generateSlug(dto.title), id)
      : existing.slug

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
      include: { category: true },
    })

    await this.revalidate.revalidate('/', '/projects', `/projects/${slug}`)
    return project
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    await this.prisma.project.delete({ where: { id } })
    await this.revalidate.revalidate('/', '/projects', `/projects/${existing.slug}`)
    return { message: 'Project deleted' }
  }

  private async resolveSlug(base: string, currentId?: string): Promise<string> {
    let slug = base
    let counter = 1

    while (true) {
      const existing = await this.prisma.project.findUnique({ where: { slug } })
      if (!existing) break
      if (currentId && existing.id === currentId) break
      slug = `${base}-${counter}`
      counter++
    }

    return slug
  }
}