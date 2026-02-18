const pool = require("../config/db");

exports.createTask = async (req, res) => {
  const { title, description, due_date } = req.body;

  try {
    const task = await pool.query(
      `INSERT INTO tasks(user_id, title, description, due_date, status)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, title, description, due_date, "pending"]
    );

    res.json(task.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Task create failed" });
  }
};


exports.getTasks = async (req, res) => {
  const tasks = await pool.query(
    "SELECT * FROM tasks WHERE user_id=$1 ORDER BY id DESC",
    [req.user.id]
  );

  res.json(tasks.rows);
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const task = await pool.query(
      "UPDATE tasks SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
      [status, id, req.user.id]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task.rows[0]); // পুরো updated row পাঠাবে
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};
