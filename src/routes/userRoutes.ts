import { Router } from "express";
import { index, store, show, update, destroy } from "../controllers/userController";

const userRouter = Router();

userRouter.route('/')
    .get(index)
    .post(store);

userRouter.route('/:id')
    .get(show)
    .put(update)
    .delete(destroy);

export default userRouter;