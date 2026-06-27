import express from "express";
import { publicRouter } from "../route/api_public.js";
import { userRouter } from "../route/api.js";
import { errorMiddleware } from '../middleware/error_middleware.js';

export const app = express();
app.use(express.json());
app.use(publicRouter);
app.use(userRouter);
app.use(errorMiddleware);