import express from "express";
import { Request, Response } from "express";
import jsonfile from "jsonfile";
import fs from "fs";
import dotenv from "dotenv";
import pg, { Client } from "pg";
const gpxParser = require("gpxparser");

const app = express();

app.use(express.json());
app.use(express.static("public"));

dotenv.config();
export const pgClient = new Client({
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
pgClient.connect();

app.post("/parsegpx", async (req: Request, res: Response) => {
  var gpx = new gpxParser();
  let theFile = "./data/2023-01-23-150805.gpx";
  let data = fs.readFileSync(theFile);
  gpx.parse(data);

  var distanceArr = gpx.tracks[0].distance;
  var geopoints = gpx.tracks[0].points;

  //insert first 10 points
  let allPoints: string[] = [];

  //replace "10" with "geopoints.length" if we want to insert all points
  for (let i = 0; i < 10; i++) {
    let location = `POINT(${geopoints[i].lat} ${geopoints[i].lon})`;
    let ele = geopoints[i].ele;
    // let coordTimes = geopoints[i].time;
    let cumul = distanceArr.cumul[i];
    const sql = `Insert into path_info (location, ele, cumul) 
    values ($1, $2, $3)`;
    await pgClient.query(sql, [location, ele, cumul]);

    // allPoints.push(`POINT(${lat} ${lng}), ${ele}, ${coordTimes}, ${cumul}`);
  }

  let duration = 0;
  let longseg: number[] = [];
  for (let i = 0; i < geopoints.length - 1; i++) {
    let timeseg = (geopoints[i + 1].time - geopoints[i].time) / 1000;
    if (timeseg < 90) {
      duration += timeseg;
    } else {
      longseg.push(i);
    }
  }

  res.json({ message: "insert successful"});
});

app.get("/getloc", async (req: Request, res: Response) => {
  const sql_1 = `SELECT ST_AsText(location) from path_info where ele < 8`;
  const result = await pgClient.query(sql_1);
  console.log(result.rows)
  res.json({ message: "select successful", location: result.rows });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
