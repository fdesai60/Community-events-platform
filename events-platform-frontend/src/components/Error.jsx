import React from "react";

const Error = ({ err }) => {
  return (
    <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <p>{err}</p>
    </div>
  );
};

export default Error;
