// More info on https://www.npmjs.com/package/gpxparser?activeTab=readme

//GPX format (From Wikipedia)
//Latitude and longitude are expressed in decimal degrees, and elevation in meters,
//both using the WGS 84 datum. Dates and times are expressed in Coordinated Universal Time (UTC) using ISO 8601 format.

const gpxParser = require("gpxparser");
const fs = require("fs");
const moment = require("moment");
const dotenv = require("dotenv");
const path = require("path");
const { Client } = require("pg");

dotenv.config();
console.log(process.env.DB_NAME);
// PostgreSQL connection details (user and password left empty)
const pgClient = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pgClient.connect();

let createdDate = new Date().getTime();
createdDate = moment(createdDate).format("YYYY-MM-DD");

var gpx = new gpxParser(); //Create gpxParser Object

let file1 = "./data/Tsuen_Wan.gpx";

let route1 = {
  file: "./data/Tsuen_Wan.gpx",
  district: "荃灣海濱",
  name: "元朗區",
};

let route2 = {
  file: "./data/Tung_Chung.gpx",
  district: "荃灣海濱",
  name: "元朗區",
};

let route3 = {
  file: "./data/Tung_Chung.gpx",
  district: "荃灣海濱",
  name: "元朗區",
};

async function main() {
  let data = fs.readFileSync(file1); //import the gpx file as string

  gpx.parse(data);

  var distanceArr = gpx.tracks[0].distance;
  var totalDistance = distanceArr.total;
  var geopoints = gpx.tracks[0].points;

  let duration = 0;

  if (geopoints[0].time) {
    let longseg = [];
    for (let i = 0; i < geopoints.length - 1; i++) {
      let timeseg = (geopoints[i + 1].time - geopoints[i].time) / 1000;
      if (timeseg < 90) {
        duration += timeseg;
      } else {
        longseg.push(i);
      }
    }
  }

  const sql_find = `SELECT * FROM route where route_name = '荃灣海濱' and users_id = (SELECT id from users where name ='admin')`;
  const coincideSearch = await pgClient.query(sql_find);
  console.log(coincideSearch.rows.length);
  if (coincideSearch.rows.length == 0) {
    const sql_1 = `INSERT INTO
        route (users_id, route_name, star_district_id, road_bicyle_track, 
        distance, duration, view_count, public_private, created_at)
    VALUES
        ((SELECT id from users where name ='admin'), '荃灣海濱', (SELECT id from district where name ='元朗區'), true, ${totalDistance}, ${duration}, 0, true, '2024-04-30')`;
    await pgClient.query(sql_1);
  }

  for (let i = 0; i < geopoints.length; i++) {
    let location = `POINT (${geopoints[i].lon} ${geopoints[i].lat})`;
    let ele = geopoints[i].ele;
    // let coordTimes = geopoints[i].time;
    let cumul = distanceArr.cumul[i];
    const sql = `Insert into path_info (route_id, location, ele, cumul) 
  values ((SELECT id from route where route_name ='荃灣海濱'), $1, $2, $3)`;
    await pgClient.query(sql, [location, ele, cumul]);
  }
}
main();

// console.log(createdDate)

// console.log(duration)

// console.log(gpx.xmlSource.location)

let geoJSON = gpx.toGeoJSON();

console.log(geoJSON.features[0].properties);
