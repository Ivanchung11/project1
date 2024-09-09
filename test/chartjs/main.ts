import express from "express";
import { Request, Response } from "express";
// import jsonfile from "jsonfile";
import { eleProfile } from "./pairupscatter";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/elevation", async (req, res) => {
  res.json({ message: "Hello World", data: eleProfile });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
// 