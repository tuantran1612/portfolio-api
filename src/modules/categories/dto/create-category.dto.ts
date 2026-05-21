import { IsString, IsOptional, MinLength, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Frontend' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'frontend' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers and hyphens only',
  })
  slug?: string;
}