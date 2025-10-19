import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";
import rateLimit from "express-rate-limit";

const app = express();

setupSwagger(app);

app.use(cors({ origin: ["http://localhost:5173"], methods: ["GET", "POST", "DELETE", "PATCH"] }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
}));

app.use(express.json());

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => res.send({ status: "ok", service: "tasks-api" }));

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});
app.use(errorHandler);

export default app;