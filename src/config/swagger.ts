// @ts-ignore
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'e-commerce App API',
            version: '1.0.0',
            description: 'An e-commerce application API using Express with TypeScript'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'Local Server'
            },
            {
                url: 'https://e-commerce-api-g4z3.onrender.com',
                description: 'Production Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                }
            },              
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        gender: { type: 'string' },
                        phone: { type: 'string' },
                        password: { type: 'string', format: 'password' },
                    },
                    required: ['name', 'email', 'password'],
                },
                UserRegister: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        gender: { type: 'string' },
                        phone: { type: 'string' },
                        password: { type: 'string', format: 'password' },
                    },
                    required: ['name', 'email', 'password'],
                },
                UserLogin: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' },
                    },
                    required: ['email', 'password'],
                }
            },
        },
    },
    apis: ['**/routes/*.ts'],
};  

export const swaggerSpec = swaggerJSDoc(options);