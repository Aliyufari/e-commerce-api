import { App } from '../src/App';
import serverless from 'serverless-http';

const appInstance = new App();
const app = appInstance.getApp();

export default serverless(app);