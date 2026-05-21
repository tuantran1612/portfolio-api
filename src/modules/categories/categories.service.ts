import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { projects: true } } },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } },
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    // use custom slug if provided, otherwise generate from name
    const baseSlug = dto.slug || generateSlug(dto.name);
    const slug = await this.resolveSlug(baseSlug);

    return this.prisma.category.create({
      data: { name: dto.name, slug },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const data: { name?: string; slug?: string } = {};

    if (dto.name) data.name = dto.name;

    if (dto.slug) {
      // custom slug provided — resolve uniqueness
      data.slug = await this.resolveSlug(dto.slug, id);
    } else if (dto.name) {
      // no custom slug but name changed — auto-generate
      data.slug = await this.resolveSlug(generateSlug(dto.name), id);
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (category._count.projects > 0) {
      throw new ConflictException(
        `Cannot delete — ${category._count.projects} project(s) still use this category`,
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }

  async seed() {
    const defaults = ['Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps'];

    const results = await Promise.allSettled(
      defaults.map(async (name) => {
        const slug = generateSlug(name);
        return this.prisma.category.upsert({
          where: { slug },
          update: {},
          create: { name, slug },
        });
      }),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    return { message: 'Categories seeded', count: succeeded };
  }

  // --- Slug resolver ---
  // Generates a unique slug, appending -1, -2 if base slug already exists
  // Skips currentId to allow updating a category without conflicting with itself
  private async resolveSlug(base: string, currentId?: string): Promise<string> {
    let slug = base;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.category.findUnique({
        where: { slug },
      });

      // no conflict
      if (!existing) break;

      // conflict is with itself (update case) — keep the slug
      if (currentId && existing.id === currentId) break;

      // conflict with another category — append counter
      slug = `${base}-${counter}`;
      counter++;
    }

    return slug;
  }
}
