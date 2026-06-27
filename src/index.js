import express from "express";
import cors from "cors";
import { publicRouter } from "./route/api_public.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(publicRouter);

const port = 3000;

app.listen(port, () => {
  console.log("App Started");
});