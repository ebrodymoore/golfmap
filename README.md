# GolfMap

A web application for golf enthusiasts to track and rank their favorite golf courses from around the world.

## Features

- **User Authentication**: Sign up and log in with username/password (coming soon)
- **Course Management**: Add golf courses with location, description, and personal notes
- **Ranking System**: Create a personalized ranking of courses you've played
- **Interactive Map**: View all your courses on a map with clickable markers (coming soon)
- **Course Details**: View detailed information about each course including your ranking

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Integration coming soon

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd golfmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Copy your project URL and anon key to `.env.local`

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses three main tables:

- **users**: User accounts with username, email, and password
- **golf_courses**: Golf course information including name, location, and coordinates
- **user_golf_course_rankings**: User-specific rankings and notes for each course

## Current Status

✅ **Completed:**
- Project setup with Next.js and TypeScript
- Supabase integration
- Database schema design
- Course list management
- Add/remove courses functionality
- Ranking system with drag-and-drop reordering

🚧 **In Progress:**
- User authentication implementation
- Maps integration
- Course detail pages

📋 **Planned:**
- Course search and discovery
- Social features (view other users' lists)
- Course photos and reviews
- Advanced filtering and sorting

## Contributing

This is currently a personal project. Feel free to fork and create your own version!

## License

MIT