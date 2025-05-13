# Creative Dimension Portfolio

A full-stack portfolio website showcasing creative projects with an admin dashboard.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Database**: SQLite (local development), PostgreSQL (production via Vercel)
- **Authentication**: Passport.js with local strategy
- **UI Framework**: Custom UI components based on Radix UI
- **Deployment**: Vercel (serverless)

## Features

- 🖼️ Interactive project portfolio with 3D elements
- 👩‍💻 Admin dashboard for content management
- 📨 Contact form with email notifications
- 🔐 Authentication for admin users
- 📱 Responsive design for all devices

## Deployment to Vercel

### Prerequisites
1. A Vercel account
2. Vercel CLI installed (`npm i -g vercel`)
3. PostgreSQL database (Vercel Postgres or external provider)

### Environment Variables
Set up the following environment variables in your Vercel project:

```
DATABASE_URL=your_postgres_connection_string
POSTGRES_URL_NON_POOLING=your_postgres_connection_string
SESSION_SECRET=your_session_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
NODE_ENV=production
```

### Deployment Steps

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy to Vercel**:
   ```bash
   ./deploy.sh
   ```
   or manually:
   ```bash
   vercel --prod
   ```

3. **Connect Database**:
   - Create a PostgreSQL database in the Vercel dashboard or use an external provider
   - Add the connection string to your Vercel environment variables

### Troubleshooting

- If you encounter build errors, check the Vercel build logs
- For database connection issues, verify your PostgreSQL connection string
- For email sending issues, make sure your email credentials are correct

## Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- GitHub account (for version control)
- Vercel account (for deployment)

### Local Development
1. Clone the repository
   ```bash
   git clone https://github.com/varunjoshi84/portfolio.git
   cd portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

### Deploying to Vercel
1. Commit your changes to git
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Deploy using the provided script
   ```bash
   ./deploy.sh
   ```

3. Configure environment variables in Vercel Dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Random string for session encryption
   - `EMAIL_USER`: Email for sending notifications
   - `EMAIL_PASS`: Password for the email account

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
