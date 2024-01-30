import { RequestHandler, Router } from "express";

import {
  registerUser,
  getAllCategory,
  loginUser,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/controller";
import {
  getAllTasks,
  createTask,
  editTask,
  deleteTask,
  toggleTaskStatus,
  getTasksForToday,
  getAllCompletedTasks,
  getAllTasksByCategory,
} from "../controllers/task.controller";
import checkAuth from "../middleware/checkAuth";
const router = Router();

//user
router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

//category
router.get(
  "/getAllCategory",
  checkAuth as unknown as RequestHandler,
  getAllCategory as unknown as RequestHandler
);
router.post(
  "/createCategory",
  checkAuth as unknown as RequestHandler,
  createCategory as unknown as RequestHandler
);
router.delete(
  "/deleteCategory/:id",
  checkAuth as unknown as RequestHandler,
  deleteCategory as unknown as RequestHandler
);
router.put(
  "/updateCategory",
  checkAuth as unknown as RequestHandler,
  updateCategory as unknown as RequestHandler
);

//tasks

router.get(
  "/getAllTasks",
  checkAuth as unknown as RequestHandler,
  getAllTasks as unknown as RequestHandler
);
router.post(
  "/createTask",
  checkAuth as unknown as RequestHandler,
  createTask as unknown as RequestHandler
);
router.get(
  "/getAllTasksByCategory/:id",
  checkAuth as unknown as RequestHandler,
  getAllTasksByCategory as unknown as RequestHandler
);
router.get(
  "/getAllCompletedTasks",
  checkAuth as unknown as RequestHandler,
  getAllCompletedTasks as unknown as RequestHandler
);
router.get(
  "/getTasksForToday",
  checkAuth as unknown as RequestHandler,
  getTasksForToday as unknown as RequestHandler
);
router.put(
  "/toggleTaskStatus/:id",
  checkAuth as unknown as RequestHandler,
  toggleTaskStatus as unknown as RequestHandler
);
router.delete(
  "/deleteTask/:id",
  checkAuth as unknown as RequestHandler,
  deleteTask as unknown as RequestHandler
);
router.put(
  "/editTask/:id",
  checkAuth as unknown as RequestHandler,
  editTask as unknown as RequestHandler
);

export default router;
