import express from "express";
import cors from "cors";;
import dotenv from "dotenv";
import { app } from "./application/web.js";

dotenv.config();


app.use(cors());
const port = 3000;
app.listen(port, () => {
  console.log("App Started");
});