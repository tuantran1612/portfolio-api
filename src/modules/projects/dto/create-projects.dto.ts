import { IsString, IsBoolean, IsOptional, IsArray, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Website' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'A personal portfolio built with Next.js' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 'Frontend' })
  @IsString()
  category: string;

  @ApiProperty({ example: ['Next.js', 'TailwindCSS', 'TypeScript'] })
  @IsArray()
  @IsString({ each: true })
  techStack: string[];

  @ApiPropertyOptional({ example: 'https://image.url/cover.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://myproject.vercel.app' })
  @IsOptional()
  @IsString()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/user/repo' })
  @IsOptional()
  @IsString()
  repoUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}