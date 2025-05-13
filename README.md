# Creative Dimension Portfolio

A full-stack portfolio website showcasing creative projects with an admin dashboard.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Database**: SQLite (via better-sqlite3 and Drizzle ORM)
- **Authentication**: Passport.js with local strategy
- **UI Framework**: Custom UI components based on Radix UI

## Features

- 🖼️ Interactive project portfolio with 3D elements
- 👩‍💻 Admin dashboard for content management
- 📨 Contact form with email notifications
- 🔐 Authentication for admin users
- 📱 Responsive design for all devices

## Project Structure

- `/client`: Frontend React application
- `/server`: Express.js backend with API routes
- `/shared`: Shared schema definitions between client and server

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd CreativeDimensionPortfolio
   ```

2. Run the setup script to install dependencies
   ```
   chmod +x setup.sh
   ./setup.sh
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

### Default Login

- **Username**: admin
- **Password**: admin123

## Development

- **API Routes**: Located in `server/routes.ts`
- **Database Models**: Defined in `shared/schema.ts`
- **React Components**: Located in `client/src/components`
- **Pages**: Located in `client/src/pages`

## Building for Production

```
npm run build
npm run start
```

This will build both the client and server code and start the application in production mode.

## License

MIT
