import { App } from '../src/App';
import serverless from 'serverless-http';

// Initialize app instance
const appInstance = new App();
const app = appInstance.getApp();

// Export the serverless handler
export default serverless(app);