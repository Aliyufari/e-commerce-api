import app from '../dist/src/index.js';
import serverless from 'serverless-http';

export default serverless(app);