const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventsRouter = require("./routes/events");
const adminRoutes = require("./routes/admin");
const {
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors")



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/events", eventsRouter);
app.use("/api/admin", adminRoutes);

app.use(postgresErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});