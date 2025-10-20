import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";

const app = express();

setupSwagger(app);


app.use(cors({ origin: ["https://tasks-api-front-end-pwoq.vercel.app/"], methods: ["GET", "POST", "DELETE", "PATCH"] }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    const err = new Error("Too many requests, please try again later.") as any;
    err.status = 429;
    next(err);
  },
}));

app.use(express.json());

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => res.send({ status: "ok", service: "tasks-api" }));

app.use(errorHandler);

export default app;