import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => res.send({ status: "ok", service: "tasks-api" }));

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;