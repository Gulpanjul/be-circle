const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  autoHeaders: false,
});

const doc = {
  info: {
    title: 'Circle API',
    description: 'Welcome to Circle API!',
  },
  servers: [
    {
      url: 'http://localhost:3001/',
      description: 'Local Server',
    },
    {
      url: 'https://gulpanjul-be-circle.vercel.app/',
      description: 'Deploy Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Bearer token for authenticated users (ID-based)',
      },
      bearerReset: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Bearer token for password reset (email-based)',
      },
    },
    schemas: {
      LoginDTO: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      RegisterDTO: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      ForgotPasswordDTO: {
        type: 'object',
        properties: {
          email: { type: 'string' },
        },
      },
      ResetPasswordDTO: {
        type: 'object',
        properties: {
          oldPassword: { type: 'string' },
          newPassword: { type: 'string' },
        },
      },
      CreateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          images: {
            type: 'string',
            format: 'binary',
          },
        },
        required: ['content'],
      },
      CreateLikeDTO: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
          },
        },
      },
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['../routes/index.ts'];

swaggerAutogen(outputFile, routes, doc);
