import { env } from "@env.js";
import express from "express";

const app = express();
const port = env.PORT;

app.get("/", (req, res) => {
  res.send("Hello will mitra !");
  console.log("Response sent");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
