import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  publishingYear: number;

  @Prop({ required: false })
  posterUrl?: string;
  
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
