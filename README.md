# Authentication App

A full-stack template demonstrating session-based authentication using React, Express, and MongoDB.

## Prerequisites

- Node.js 18+
- Podman
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sauagarwa/oic-finance-app.git
cd oic-finance-aoo
```

2. Install client-side dependencies:
```bash
npm install
```

3. Run MongoDb locally

``` sh
podman pull mongo:4.0.4
podman run -d -p 27017:27017 --name mongo mongo:latest

```

4. Create your environment variables:
```bash
cp .env.example .env
```

5. Update your `.env` file with the following:
```env
# Your MongoDB database URL
DATABASE_URL=mongodb://localhost:27017

# Development settings (can leave as is)
VITE_API_URL="http://localhost:5050"
NODE_ENV="development"
```

6. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── server.js        # Server entry point
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── AuthProvider.jsx # Authentication
│   ├── main.jsx         
│   ├── index.html         
└── package.json
```

## Authentication Flow

1. User signs up/logs in through the frontend
2. Backend validates credentials and creates a session
3. Session ID is stored in an HTTP-only cookie
4. Frontend can check auth status via the `/api/auth/me` endpoint
5. Protected routes/resources check for valid session

## Building for Production

1. Build the project:
```bash
npm run build:all
```

This command will:
- Build the React frontend
- Move all assets to the correct locations (/dist)

1. Start the production server:
```bash
npm start
```


The production build will be available at the port specified in your environment variables (default: 3000).

### Deployment Options

You can deploy this application to any platform that supports Node.js applications. General steps:

1. Build the project using `npm run build:all`
2. Set up your environment variables
3. Run `npm start` to start the production server

Remember to:
- Use HTTPS in production
- Set up proper security headers
- Configure your database connection string
- Set `NODE_ENV` to "production"

## Contributing

Feel free to submit issues and pull requests!

## License

MIT
