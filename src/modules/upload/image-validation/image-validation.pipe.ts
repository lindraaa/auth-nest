import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  transform(file?: Express.Multer.File) {
    if (!file) {
      return undefined;
    }
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size too large. Max allowed size is ${this.maxSize / (1024 * 1024)}MB`,
      );
    }

    return file;
  }
}
