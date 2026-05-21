import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({ example: 'john@portfolio.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'strongpassword' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ enum: ['admin', 'staff'], example: 'staff' })
  @IsEnum(['admin', 'staff'])
  role: 'admin' | 'staff'
}