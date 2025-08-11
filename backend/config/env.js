const validateEnv = () => {
    // Set default values for development first
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
    }
    
    if (!process.env.MONGO_URI) {
        process.env.MONGO_URI = 'mongodb://localhost:27017/fit-tracker';
    }
    
    if (!process.env.SECRET_KEY) {
        process.env.SECRET_KEY = 'dev-secret-key-32-characters-long-for-development-only';
    }
    
    if (!process.env.FRONTEND_URL) {
        process.env.FRONTEND_URL = 'http://localhost:5173';
    }

    const requiredEnvVars = [
        'MONGO_URI',
        'SECRET_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars.join(', '));
        process.exit(1);
    }

    // Validate MongoDB URI format
    if (!process.env.MONGO_URI.startsWith('mongodb://') && !process.env.MONGO_URI.startsWith('mongodb+srv://')) {
        console.error('Invalid MongoDB URI format');
        process.exit(1);
    }

    // Validate SECRET_KEY length
    if (process.env.SECRET_KEY.length < 32) {
        console.error('SECRET_KEY must be at least 32 characters long');
        process.exit(1);
    }

    // Validate NODE_ENV
    if (!['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
        console.error('NODE_ENV must be one of: development, production, test');
        process.exit(1);
    }

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Environment validation passed');
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('MongoDB URI:', process.env.MONGO_URI ? '✓ Set' : '✗ Missing');
        console.log('SECRET_KEY:', process.env.SECRET_KEY ? '✓ Set' : '✗ Missing');
        console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? '✓ Set' : '✗ Missing');
        console.log('⚠️  WARNING: Using development defaults. Change these for production!');
    }
};

module.exports = validateEnv;
