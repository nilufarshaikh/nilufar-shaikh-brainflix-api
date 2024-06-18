import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

const { PORT, CORS_ORIGIN } = process.env;
app.use(cors({ origin: CORS_ORIGIN }));

app.get("/", (req, res) => {
  res.send("Welcome to /");
});

app.listen(PORT || 8080, (req, res) => {
  console.log(`Server is listening on port ${PORT}`);
});
