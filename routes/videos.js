import express from "express";
import fs from "fs";
import uuid4 from "uuid4";
import dotenv from "dotenv";

dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL;

const router = express.Router();

const readVideos = () => {
  const videosFile = fs.readFileSync("./data/videos.json");
  return JSON.parse(videosFile);
};

// GET /videos
router.get("/", (_req, res) => {
  try {
    const videosData = readVideos();
    const videos = videosData.map((video) => {
      return {
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      };
    });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching the video" });
  }
});

// GET /videos/:id
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const videosData = readVideos();
    const video = videosData.find((video) => {
      if (video.id === id) {
        video.image = video.image;
        return video;
      }
    });

    if (!video) {
      res.status(400).json({ message: "No video with that id exists" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching the video" });
  }
});

// POST /videos
router.post("/", (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newVideo = {
      id: uuid4(),
      title: title || "New video title",
      description: description || "Some decription about the video",
      image: image || "http://localhost:8080/images/thumbnail.jpg",
      channel: "Nilufar Shaikh",
      views: 0,
      likes: 0,
      duration: "49:20",
      video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
      timestamp: Date.now(),
      comments: [
        {
          id: uuid4(),
          name: "Trudy Jankowski",
          comment: "I really enjoyed this video! Thanks for posting",
          likes: 3,
          timestamp: Date.now(),
        },
      ],
    };

    const videosData = readVideos();
    const videos = JSON.stringify([...videosData, newVideo]);
    fs.writeFileSync("./data/videos.json", videos);
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json("Error while uploading the video.");
  }
});

export default router;
