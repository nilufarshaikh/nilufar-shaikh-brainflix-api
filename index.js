import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import videoRoutes from "./routes/videos.js";

const app = express();
app.use(express.json());

dotenv.config();
const { PORT, CORS_ORIGIN } = process.env;
app.use(cors({ origin: CORS_ORIGIN }));

app.use("/images", express.static("public/images"));

app.use((req, res, next) => {
  if (req.query.api_key !== "09187f07-f407-42d7-af19-75b70c181c1f") {
    return res.status(401).send("You must provide a valid API key.");
  }

  next();
});

app.use("/videos", videoRoutes);

app.listen(PORT || 8080, (req, res) => {
  console.log(`Server is listening on port ${PORT}`);
});
