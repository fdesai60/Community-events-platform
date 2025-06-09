import "../App.css";
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Error from "../components/Error"; 

export default function Login() {
  const [error, setError] = useState(null); 

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar.events",
        },
      });
      setError(null); 
    } catch (err) {
      setError(err.message || "Google sign-in failed."); 
    }
  };

  return (
    <div className="login">
      {error && <Error err={error} />} 
      <h1>Welcome</h1>
      <p>Please sign in with Google to continue</p>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}
