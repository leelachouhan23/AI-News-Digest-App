import { Router } from "express";
import { generateDigest } from "../controllers/digestController.js";

const router = Router();

router.post("/digest", generateDigest);

export default router;
