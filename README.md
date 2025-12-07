#  Movie Management Full Stack App

A full-stack Movie Management Web Application built with \*\*Next.js (Frontend)\*\* and \*\*NestJS (Backend)\*\* using \*\*MongoDB, Cloudinary, JWT Authentication, and Swagger API Documentation\*\*.

This project allows users to:

- Register & Login

- Create, Edit & Delete Movies

- Upload Movie Posters

- View Movies with Pagination

- Secure Access using JWT

- Responsive UI based on Figma Design

---



## Project Structure
Assignment2/

├── movie-backend/ # NestJS Backend

└── movie-frontend/ # Next.js Frontend

---



##  Tech Stack

### Frontend

- Next.js 14 (App Router)

- Tailwind CSS

- React Hook Form + Zod

- Zustand (State Management)

- Axios

- SweetAlert2

- Dark Themed Figma UI



### Backend

- NestJS

- MongoDB + Mongoose

- Cloudinary Image Upload

- JWT Authentication (Access + Refresh)

- Rate Limiting

- Swagger API Documentation

- Multer (File Upload)



---



#  Backend Setup (NestJS)



### 1. Go to backend folder

```

cd movie-backend

2. Install dependencies


npm install

3. Create .env file

env


PORT=4000

MONGO_URI=your_mongodb_atlas_url

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

4. Run backend


npm run start:dev

5. Swagger API

Open in browser:

http://localhost:4000/api/docs

#Frontend Setup (Next.js)

1. Go to frontend folder


cd movie-frontend

2. Install dependencies


npm install

3. Create .env.local

env


NEXT_PUBLIC_API_URL=http://localhost:4000/api

4. Run frontend


npm run dev

Frontend will run on:

http://localhost:3000

Authentication Flow

Login & Register using JWT



Access token stored in Zustand + LocalStorage



Refresh token supported



Protected routes for Movies



#Features

Upload movie poster images

Cloudinary optimized images

SweetAlert delete confirmation

Pagination with backend meta data

Fully responsive dark UI

Empty state screens

Form validation using Zod



#API Modules

Auth (Register, Login, Refresh)

Movies (CRUD + Pagination)

Upload (Cloudinary images)



#Deployment (Planned)

AWS EC2 / S3 / Nginx

MongoDB Atlas
Cloudinary CDN



#Developer

Shivam
Full Stack Developer



#License

This project is for assessment and learning purposes.


---

