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
        server: [
            {
                uri: `http://localhost:${process.env.PORT}`
            }
        ]
    },
    apis: ['./src/routes*.ts']
}

export const swaggerSpec = swaggerJSDoc(options);