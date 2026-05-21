import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Frontend' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'frontend' })
  @IsString()
  @MinLength(2)
  slug: string;
}