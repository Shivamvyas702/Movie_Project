import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie, MovieSchema } from './schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
    ]),

    // ✅ Multer global config for movies
    MulterModule.register({
      limits: {
        fileSize: 2 * 1024 * 1024, 
      },
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
