// @ts-ignore
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'e-commerce App API',
            version: '1.0.0',
            description: 'An e-commerce application API using Express with TypeScript'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ]
    },
    components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              gender: { type: 'string', format: 'gender' },
              phone: { type: 'string', format: 'phone' },
              password: { type: 'string', format: 'password' },
            },
            required: ['name', 'email', 'password'],
          },
        },
    },
    apis: ['**/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options);