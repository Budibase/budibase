const express = require("express");
const router = express.Router();

// Simple in-memory store for demo. Replace with DB calls in production.
let workspacesStore = [];

// GET /api/workspaces
router.get("/", async (req, res) => {
  res.json(workspacesStore);
});

// POST /api/workspaces/:id/select
router.post("/:id/select", async (req, res) => {
  const id = req.params.id;
  return res.json({ ok: true, selectedWorkspace: id });
});

// PUT /api/workspaces/:id/limits
router.put("/:id/limits", async (req, res) => {
  const id = req.params.id;
  const { maxUsers, maxRows } = req.body || {};
  if (maxUsers == null || maxRows == null) {
    return res.status(400).json({ ok: false, error: "missing fields" });
  }

  const idx = workspacesStore.findIndex((w) => w._id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "workspace not found" });

  workspacesStore[idx].limits = { maxUsers: Number(maxUsers), maxRows: Number(maxRows) };
  return res.json({ ok: true, workspace: workspacesStore[idx] });
});

// Dev-only helper to set the in-memory store from JSON
router.post("/_setStore", (req, res) => {
  workspacesStore = req.body || [];
  res.json({ ok: true, count: workspacesStore.length });
});

module.exports = router;
