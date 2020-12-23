import express from "express";
const port = process.env.PORT || 5000;

const app = express();
app.use(express.static("."));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
