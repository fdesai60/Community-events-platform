import "../App.css"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import Loading from "../components/Loading";
import Error from "../components/Error"; 

export default function Home({ isStaff }) {  
  const [events, setEvents] = useState([]);
  const [signedUpEventIds, setSignedUpEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [signupMessage, setSignupMessage] = useState("");
  const [error, setError] = useState(null); 

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5001/api/events");
        setEvents(res.data);

        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (token) {
          const signedUpRes = await axios.get("http://localhost:5001/api/events/signed-up", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const ids = signedUpRes.data.map((e) => e.id);
          setSignedUpEventIds(new Set(ids));
        }
        setError(null); 
      } catch (error) {
        console.error("Error fetching events or signups:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleSignup(eventId) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const userId = data.session?.user.id;

      if (!token || !userId) {
        setSignupMessage("Please log in first.");
        clearMessageAfterDelay();
        return;
      }

      await axios.post(
        `http://localhost:5001/api/events/${eventId}/signup`,
        { user_id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSignupMessage("Signed up successfully!");
      setSignedUpEventIds((prev) => new Set([...prev, eventId]));
      setError(null); 
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.response?.data?.error || "Failed to sign up.");
    } finally {
      clearMessageAfterDelay();
    }
  }

  async function addToGoogleCalendar(event) {
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.provider_token;

      if (!accessToken) {
        setSignupMessage("Missing Google access. Try logging out and logging in again with Google.");
        clearMessageAfterDelay();
        return;
      }

      const calendarEvent = {
        summary: event.title,
        description: event.description || "",
        location: event.location || "",
        start: {
          dateTime: new Date(event.date).toISOString(),
          timeZone: "Europe/London",
        },
        end: {
          dateTime: new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: "Europe/London",
        },
      };

      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calendarEvent),
      });

      if (response.ok) {
        setSignupMessage("Event added to your Google Calendar!");
        setError(null); 
      } else {
        const err = await response.json();
        console.error("Calendar API error:", err);
        setError("Failed to add event to calendar.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong adding to calendar.");
    } finally {
      clearMessageAfterDelay();
    }
  }

  async function handleDelete(eventId) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setSignupMessage("Please log in again.");
        clearMessageAfterDelay();
        return;
      }

      await axios.delete(`http://localhost:5001/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setSignupMessage("Event deleted successfully!");
      setError(null); 
    } catch (error) {
      console.error("Delete failed:", error);
      setError(error.response?.data?.error || "Failed to delete event.");
    } finally {
      clearMessageAfterDelay();
    }
  }

  function clearMessageAfterDelay() {
    setTimeout(() => setSignupMessage(""), 4000); 
  }

  if (loading) return <Loading/>

  return (
    <div className="home">
      <h1>Community Events</h1>

      {error && <Error err={error} />} 
      {signupMessage && <p>{signupMessage}</p>} 

      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul className="events">
          {events.map((event) => {
            const isSignedUp = signedUpEventIds.has(event.id);
            return (
              <li key={event.id}>
                {isStaff && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                )}
                <h2>{event.title}</h2>
                <p>
                  {new Date(event.date).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p>{event.location}</p>

                <button
                  onClick={() => handleSignup(event.id)}
                  disabled={isSignedUp}
                >
                  {isSignedUp ? "Already Signed Up" : "Sign Up"}
                </button>

                {isSignedUp && (
                  <button onClick={() => addToGoogleCalendar(event)}>
                    Add to Google Calendar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
