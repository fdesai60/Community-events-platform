CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location TEXT
);

CREATE TABLE signups (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  event_id INTEGER REFERENCES events(id)
);