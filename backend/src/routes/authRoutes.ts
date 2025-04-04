import express, { Request, Response, NextFunction } from "express";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register as unknown as express.RequestHandler);
router.post("/login", login as unknown as express.RequestHandler);

// Protected routes
router.get(
  "/me",
  protect as unknown as express.RequestHandler,
  getMe as unknown as express.RequestHandler
);

export default router;
