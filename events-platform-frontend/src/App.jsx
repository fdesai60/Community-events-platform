import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Error from "./components/Error"; 

export default function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error; 

        setSession(data.session);
        if (data.session) {
          const userRole = data.session.user?.user_metadata?.role || "user";
          setRole(userRole);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const userRole = session?.user?.user_metadata?.role || "user";
      setRole(userRole);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error err={error} />; 

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isStaff = role === "staff";

  return (
    <>
      <Header onLogout={() => supabase.auth.signOut()} isStaff={isStaff} />
      <Routes>
        <Route path="/events" element={<Home session={session} isStaff={isStaff} />} />
        {isStaff && <Route path="/create-event" element={<CreateEvent />} />}
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </>
  );
}

