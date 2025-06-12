const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  autoHeaders: false,
});

const doc = {
  info: {
    title: 'Circle API',
    description: 'Welcome to Circle API!',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
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
          content: { type: 'string' },
          image: { type: 'file' },
        },
      },
    },
  },
  host: 'localhost:3001',
};

const outputFile = './swagger-output.json';
const routes = ['src/routes/index.ts'];

swaggerAutogen(outputFile, routes, doc);
