import { IsString, IsBoolean, IsOptional, IsArray, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Website' })
  @IsString()
  @MinLength(3)
  title: string

  @ApiProperty({ example: 'A personal portfolio built with Next.js' })
  @IsString()
  @MinLength(10)
  description: string

  @ApiProperty({ example: 'clx1234abcd' })
  @IsString()
  categoryId: string

  @ApiProperty({ example: ['Next.js', 'TailwindCSS', 'TypeScript'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[]

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