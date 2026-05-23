import { PartialType } from '@nestjs/swagger'
import { CreateProjectDto } from './create-projects.dto'

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}