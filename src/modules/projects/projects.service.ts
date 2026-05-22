import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { RevalidateService } from '../../common/services/revalidate.service'
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService,private revalidate: RevalidateService,) {}

  findAll(categorySlug?: string, featured?: boolean) {
    return this.prisma.project.findMany({
      where: {
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(featured !== undefined && { featured }),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: dto,
      include: { category: true },
    })
    await this.revalidate.revalidate('/', '/projects')
    return project
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id)
    const project = await this.prisma.project.update({
      where: { id },
      data: dto,
      include: { category: true },
    })
    await this.revalidate.revalidate('/', '/projects')
    return project
  }

  async remove(id: string) {
    await this.findOne(id)
    const project = await this.prisma.project.delete({ where: { id } })
    await this.revalidate.revalidate('/', '/projects')
    return project
  }
}
