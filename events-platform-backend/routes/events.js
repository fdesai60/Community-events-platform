const express = require("express");
const pool = require("../db");
const requireStaff = require("../middleware/requireStaff");
const requireUser = require("../middleware/requireUser");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/signup", async (req, res, next) => {
  const event_id = req.params.id;
  const { user_id } = req.body;

  if (!user_id) return next({ status: 400, msg: "Missing user_id" });

  try {
    await pool.query(
      "INSERT INTO signups (user_id, event_id) VALUES ($1, $2)",
      [user_id, event_id]
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post("/create", requireStaff, async (req, res, next) => {
  const { title, description, date, location } = req.body;

  if (!title || !description || !date || !location) {
    return next({ status: 400, msg: "Missing required event fields" });
  }

  try {
    await pool.query(
      "INSERT INTO events (title, description, date, location) VALUES ($1, $2, $3, $4)",
      [title, description, date, location]
    );
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

router.get("/signed-up", requireUser, async (req, res, next) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT events.*
      FROM events
      JOIN signups ON events.id = signups.event_id
      WHERE signups.user_id = $1
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireStaff, async (req, res, next) => {
  const eventId = req.params.id;

  try {
    await pool.query("DELETE FROM signups WHERE event_id = $1", [eventId]);
    await pool.query("DELETE FROM events WHERE id = $1", [eventId]);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
