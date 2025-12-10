import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // ✅ CREATE
  @Post()
  @UseInterceptors( FileInterceptor('poster', {
    limits: { fileSize: 2 * 1024 * 1024 },
  }),)
  create(
    @Body() dto: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.moviesService.create(dto, file);
  }

  // ✅ LIST
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.moviesService.findAll(Number(page), Number(limit), search);
  }

  // ✅ SINGLE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  // ✅ UPDATE (SAFE IMAGE REPLACE)
  @Put(':id')
  @UseInterceptors( FileInterceptor('poster', {
    limits: { fileSize: 2 * 1024 * 1024 },
  }),)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMovieDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.moviesService.update(id, dto, file);
  }

  // ✅ DELETE (DB + CLOUDINARY CLEAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.deleteMovie(id);
  }
}
