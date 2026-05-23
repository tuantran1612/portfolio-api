import { IsString, IsBoolean, IsOptional, IsArray, MinLength, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty({ example: 'My Portfolio Website' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: 'my-portfolio-website' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers and hyphens only',
  })
  slug?: string

  @ApiProperty({ example: 'A personal portfolio built with Next.js' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ example: '<p>Full project description...</p>' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ example: 'clx1234abcd' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: ['Next.js', 'TailwindCSS', 'TypeScript'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  liveUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  repoUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean
}