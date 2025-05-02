import { Router } from "express";
import { ValidationChain } from "express-validator";
import { index, store, show, update, destroy } from "../controllers/userController";
import { validate } from "../middlewares/validationMiddleware";
import { userValidation } from "../validations/userValidation";

const userRouter = Router();

userRouter.route('/')
    .get(validate(userValidation.pagination as ValidationChain[]), index)
    .post(validate(userValidation.createUser as ValidationChain[]), store);

userRouter.route('/:id')
    .get(validate(userValidation.userId as ValidationChain[]), show)
    .put(validate([
        ...userValidation.userId as ValidationChain[], 
        ...userValidation.updateUser as ValidationChain[]
    ]), update)
    .delete(validate(userValidation.userId as ValidationChain[]), destroy);

export default userRouter;
