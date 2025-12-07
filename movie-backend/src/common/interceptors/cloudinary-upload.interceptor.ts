import { FileInterceptor } from '@nestjs/platform-express';

export const CloudinaryFileInterceptor = (fieldName = 'poster') =>
  FileInterceptor(fieldName);
