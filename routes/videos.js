import express from "express";
import fs from "fs";
import uniqid from "uniqid";
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
        image: `${BACKEND_URL}/images/${video.image}`,
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
        video.image = `${BACKEND_URL}/images/${video.image}`;
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
    const { title, description } = req.body;
    const newVideo = {
      id: uniqid(),
      title: title,
      description: description,
      image: `${BACKEND_URL}/images/image0.jpg`,
      channel: "Nilufar Sahikh",
      views: "3,092,284",
      likes: "75,985",
      duration: "49:20",
      video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
      timestamp: Date.now(),
      comments: [
        {
          id: "2d818087-c1f4-4ec2-bcdc-b545fd6ec258",
          name: "Uzo Anayolisa",
          comment:
            "The historical perspective, combined with the technological advancements, offers a comprehensive view of how trains have shaped our world. I'm eager to learn more about the fascinating stories behind these incredible locomotives. Keep the railway adventures coming!",
          likes: 3,
          timestamp: Date.now(),
        },
        {
          id: "191de346-b3c2-47b4-bf5b-6db90d1e3bdc",
          name: "Walid Marghub Haik",
          comment:
            "Your documentary on the history and technology of trains is a delightful treat for railway enthusiasts like me. The attention to detail and the chronological journey through time make it an educational and entertaining experience.",
          likes: 0,
          timestamp: Date.now(),
        },
      ],
    };

    const videosData = readVideos();
    const videos = JSON.stringify([...videosData, newVideo]);
    fs.writeFileSync("./data/videos.json", videos);
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json("Error while adding videos.");
  }
});

export default router;
