import { App } from "./App";
import dotenv from "dotenv";

dotenv.config();

const init = () => {
    const appInstance = new App();
    if (process.env.NODE_ENV !== 'production') {
        appInstance.listen();
    }
    
    return appInstance.getApp();
}

const app = init();

export default app;