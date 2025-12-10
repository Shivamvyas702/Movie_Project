import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import cloudinary from '../common/cloudinary';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
  ) { }

  // ✅ Upload helper
  async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'movies',
          resource_type: 'image',
          quality: 'auto:good',     // ✅ aggressive compression
          fetch_format: 'auto',     // ✅ webp/avif auto
          flags: 'lossy',           // ✅ further size reduce
          timeout: 120000,          // ✅ 120s safety timeout
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }
  
  

  // ✅ CREATE
  async create(dto: CreateMovieDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Poster image is required');
    }
  
    const uploadResult: any = await this.uploadToCloudinary(file);
  
    return this.movieModel.create({
      ...dto,
      posterUrl: uploadResult.secure_url,
    });
  }
  
  // ✅ FIND ALL (with pagination)
async findAll(page = 1, limit = 10, search?: string) {
  const skip = (page - 1) * limit;

  const filter: any = {};

  // ✅ SEARCH FILTER (TITLE)
  if (search && search.trim() !== '') {
    filter.title = { $regex: search, $options: 'i' };
  }

  const [data, total] = await Promise.all([
    this.movieModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    this.movieModel.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
}


  // ✅ FIND ONE
  async findOne(id: string) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  // ✅ UPDATE (SAFE CLOUDINARY REPLACE)
  async update(
    id: string,
    updateData: UpdateMovieDto,
    file?: Express.Multer.File,
  ) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException('Movie not found');

    if (file) {
      if (movie.posterUrl) {
        const publicId = this.getCloudinaryPublicId(movie.posterUrl);
        await cloudinary.uploader.destroy(`movies/${publicId}`);
      }

      const uploadResult: any = await this.uploadToCloudinary(file);
      updateData.posterUrl = uploadResult.secure_url;
    }

    return this.movieModel.findByIdAndUpdate(id, updateData, { new: true });
  }


  // ✅ DELETE (DB + CLOUDINARY CLEANUP)
  async deleteMovie(id: string) {
    const movie = await this.movieModel.findById(id);
    if (!movie) throw new NotFoundException('Movie not found');

    if (movie.posterUrl) {
      const publicId = this.getCloudinaryPublicId(movie.posterUrl);
      await cloudinary.uploader.destroy(`movies/${publicId}`);
    }

    await movie.deleteOne();
    return { message: 'Movie deleted successfully' };
  }
  private getCloudinaryPublicId(url: string) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1]; // xyz.jpg
    return filename.split('.')[0]; // xyz
  }
  
}
