import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  transform(files?: Express.Multer.File | Express.Multer.File[]) {
    if (!files) return undefined;

    const array = Array.isArray(files) ? files : [files];

    for (const file of array) {
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type`);
      }
      if (file.size > this.maxSize) {
        throw new BadRequestException(`File too large (max 5MB)`);
      }
    }

    return files;
  }
}
