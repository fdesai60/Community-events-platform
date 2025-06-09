import "../App.css";
import React, { useState } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import Error from "../components/Error"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(null); 

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/events/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Event created!");
      setForm({ title: "", description: "", date: "", location: "" });
      setError(null); 
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.response?.data?.error || "Error creating event.");
    } finally {
      clearMessageAfterDelay();
    }
  }

  function clearMessageAfterDelay() {
    setTimeout(() => {
      setMessage("");
      setError(null);
    }, 4000);
  }

  return (
    <div className="create-event">
      <h1>Create Event</h1>

      {error && <Error err={error} />} 
      {message && <p style={{ color: "green" }}>{message}</p>} 

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <br />
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
