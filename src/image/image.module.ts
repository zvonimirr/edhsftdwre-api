import { Module } from '@nestjs/common';
import { ImageController } from '@/image/image.controller';
import { ImageService } from '@/image/image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
