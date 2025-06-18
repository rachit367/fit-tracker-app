# Fit Tracker Pro

A modern fitness tracking application that helps users monitor their workouts, track progress, and achieve their fitness goals.

## Features

- User authentication and authorization
- Workout tracking and management
- Progress monitoring
- Responsive and modern UI
- Real-time notifications
- Secure data storage

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios for API requests
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled
- Cookie Parser for session management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fit-tracker-pro
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
fit-tracker-pro/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── utils/
    ├── config/
    └── app.js
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### Workouts
- GET /api/workouts - Get all workouts
- POST /api/workouts - Create a new workout
- GET /api/workouts/:id - Get a specific workout
- PUT /api/workouts/:id - Update a workout
- DELETE /api/workouts/:id - Delete a workout

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Rachit
