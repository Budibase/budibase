import React, { useEffect, useState } from "react";

const STORAGE_KEY = "selectedWorkspaceId";

export default function WorkspaceSelector({ apiBase = "/api" }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLimits, setEditingLimits] = useState(false);
  const [limitsDraft, setLimitsDraft] = useState({ maxUsers: 0, maxRows: 0 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${apiBase}/workspaces`)
      .then((r) => r.json())
      .then((data) => {
        setWorkspaces(data || []);
        let stored = localStorage.getItem(STORAGE_KEY);
        if (stored && data.find((w) => w._id === stored)) {
          setSelected(stored);
        } else if (data.length) {
          setSelected(data[0]._1d || data[0]._id);
          localStorage.setItem(STORAGE_KEY, data[0]._id);
        }
      })
      .finally(() => setLoading(false));
  }, [apiBase]);

  useEffect(() => {
    if (!selected) return;
    localStorage.setItem(STORAGE_KEY, selected);
  }, [selected]);

  const selectWorkspace = async (id) => {
    setSelected(id);
    try {
      await fetch(`${apiBase}/workspaces/${id}/select`, { method: "POST" });
      setMessage("Workspace selected");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to select workspace");
    }
  };

  const openEdit = (ws) => {
    setEditingLimits(ws._id);
    setLimitsDraft({
      maxUsers: ws.limits?.maxUsers ?? 10,
      maxRows: ws.limits?.maxRows ?? 1000,
    });
  };

  const saveLimits = async (id) => {
    try {
      const res = await fetch(`${apiBase}/workspaces/${id}/limits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(limitsDraft),
      });
      if (!res.ok) throw new Error("save failed");
      setWorkspaces((prev) =>
        prev.map((w) => (w._id === id ? { ...w, limits: { ...limitsDraft } } : w))
      );
      setEditingLimits(false);
      setMessage("Limits updated");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update limits");
    }
  };

  if (loading) return <div>Loading workspaces…</div>;
  if (!workspaces.length) return <div>No workspaces found.</div>;

  const active = workspaces.find((w) => w._id === selected) || workspaces[0];

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, maxWidth: 520 }}>
      <h3>Workspace</h3>
      <select value={selected || ""} onChange={(e) => selectWorkspace(e.target.value)}>
        {workspaces.map((w) => (
          <option key={w._id} value={w._id}>
            {w.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 12 }}>
        <strong>Active:</strong> {active.name}{" "}
        <small style={{ color: "#666" }}>({active._id})</small>
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Limits:</strong>
        <div>Max users: {active.limits?.maxUsers ?? "—"}</div>
        <div>Max rows: {active.limits?.maxRows ?? "—"}</div>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => openEdit(active)} style={{ marginRight: 8 }}>
          Edit limits
        </button>
        {message && <span style={{ marginLeft: 8 }}>{message}</span>}
      </div>

      {editingLimits === active._id && (
        <div style={{ marginTop: 10, background: "#fafafa", padding: 8, borderRadius: 6 }}>
          <div>
            <label>Max users:</label>
            <input
              type="number"
              value={limitsDraft.maxUsers}
              onChange={(e) => setLimitsDraft({ ...limitsDraft, maxUsers: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Max rows:</label>
            <input
              type="number"
              value={limitsDraft.maxRows}
              onChange={(e) => setLimitsDraft({ ...limitsDraft, maxRows: Number(e.target.value) })}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => saveLimits(active._id)} style={{ marginRight: 6 }}>
              Save
            </button>
            <button onClick={() => setEditingLimits(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
