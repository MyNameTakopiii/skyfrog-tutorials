// index.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const requestLogger = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] มีการเรียก ${req.method} ที่ ${req.url}`
  );
  next();
};

app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hello World! Backend (NeonDB + Prisma) ทำงานแล้ว 🎉");
});

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});
