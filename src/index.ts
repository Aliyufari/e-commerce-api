import { App } from "./App";
import { connectDB } from "./config/db";

const init = async () => {
    await connectDB();
    const app = new App();
    app.listen();
}

init();