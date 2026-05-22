import {
  Controller, Post, Delete, Param,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { UploadService } from './upload.service'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorators'

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'staff')
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload image to Cloudinary — admin/staff only' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadImage(file)
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete image from Cloudinary — admin/staff only' })
  async deleteImage(@Param('publicId') publicId: string) {
    await this.uploadService.deleteImage(publicId)
    return { message: 'Image deleted' }
  }
}