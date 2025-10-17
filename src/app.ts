import express from "express";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());



app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

export default app;
