import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";
import { setupSwagger } from "./config/swagger";

const app = express();

setupSwagger(app);

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => res.send({ status: "ok", service: "tasks-api" }));

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;