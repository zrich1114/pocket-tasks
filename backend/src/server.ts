import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT ?? 5174;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
