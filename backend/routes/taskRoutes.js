const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/status", auth, updateTaskStatus);
router.delete("/:id", auth, deleteTask);

module.exports = router;
