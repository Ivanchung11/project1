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
// console.log(process.env.DB_NAME);
// PostgreSQL connection details (user and password left empty)
const pgClient = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pgClient.connect();

let createdDate = new Date();
// createdDate = moment(createdDate.getTime()).format("YYYY-MM-DD");

var gpx = new gpxParser(); //Create gpxParser Object

let file1 = "./data/Tsuen_Wan.gpx";

let route1 = {
  filepath: "./data/Tung_Chung.gpx",
  routeName: "東涌炮台",
  description: "有段路望到而家填緊海嘅地方",
  startDistrict: "離島區",
  endDistrict: "",
  uploader: "admin1",
  isRoad: true,
  isPublic: false,
};

let route2 = {
  filepath: "./data/2023-01-23-150805.gpx",
  routeName: "屯門青山公路",
  description: "轉車站附近很適合看日落，但今天很曬",
  startDistrict: "屯門區",
  endDistrict: "荃灣區",
  uploader: "admin5",
  isRoad: false,
  isPublic: true,
};

let route3 = {
  filepath: "./data/Yuen_Long.gpx",
  routeName: "元朗-南生圍-錦繡花園-上水",
  description: "錦田附近很多魚塘很美",
  startDistrict: "元朗區",
  endDistrict: "北區",
  uploader: "admin",
  isRoad: false,
  isPublic: true,
};

let route4 = {
  filepath: "./data/Tsuen_Wan.gpx",
  routeName: "荃灣海濱",
  description: "荃灣海濱路徑短，風景美",
  startDistrict: "元朗區",
  endDistrict: "",
  uploader: "admin",
  isRoad: true,
  isPublic: true,
};

let route5 = {
  filepath: "./data/small_round.gpx",
  routeName: "深水埗-上水-深水埗",
  description: "呢條友係唔係有咩睇唔開，踩埋條令人差啲虛脫嘅路線",
  startDistrict: "深水埗區",
  endDistrict: "深水埗區",
  uploader: "admin",
  isRoad: true,
  isPublic: false,
};

async function insertroute(routeObj) {
  let data = await fs.readFileSync(routeObj.filepath); //import the gpx file as string
  gpx.parse(data);
  console.log(gpx.tracks[gpx.tracks.length - 1].name);
  console.log("=============");

  var distanceArr = gpx.tracks[gpx.tracks.length - 1].distance;
  var totalDistance = distanceArr.total;
  var geopoints = gpx.tracks[gpx.tracks.length - 1].points;

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

  const sql_find = `SELECT * FROM route where route_name = '${routeObj.routeName}' and users_id = (SELECT id from users where name = '${routeObj.uploader}')`;
  const coincideSearch = await pgClient.query(sql_find);
  console.log(coincideSearch.rows.length);
  if (coincideSearch.rows.length == 0) {
    const sql_1 = `INSERT INTO
        route (users_id, route_name, description, star_district_id, end_district_id, road_bicyle_track,
        distance, duration, view_count, public_private, created_at)
    VALUES
        ((SELECT id from users where name ='${routeObj.uploader}'), '${routeObj.routeName}', '${routeObj.description}', (SELECT id from district where name ='${routeObj.startDistrict}'),(SELECT id from district where name ='${routeObj.endDistrict}'), ${routeObj.isRoad}, ${totalDistance}, ${duration}, 0, ${routeObj.isPublic}, now())`;
    await pgClient.query(sql_1);

  let maxlon = geopoints[0].lon;
  let minlon = geopoints[0].lon;
  let maxlat = geopoints[0].lat;
  let minlat = geopoints[0].lat;

  for (let i = 0; i < geopoints.length; i++) {
    let location = `POINT (${geopoints[i].lon} ${geopoints[i].lat})`;
    let ele = geopoints[i].ele;
    // let coordTimes = geopoints[i].time;
    let cumul = distanceArr.cumul[i];
    const sql = `Insert into path_info (route_id, location, ele, cumul) 
    values ((SELECT id from route where route_name ='${routeObj.routeName}'), $1, $2, $3)`;
    await pgClient.query(sql, [location, ele, cumul]);

    if (geopoints[i].lon > maxlon) {
      maxlon = geopoints[i].lon;
    }
    if (geopoints[i].lon < minlon) {
      minlon = geopoints[i].lon;
    }
    if (geopoints[i].lat > maxlat) {
      maxlat = geopoints[i].lat;
    }
    if (geopoints[i].lat < minlat) {
      minlat = geopoints[i].lat;
    }
  }
  let midlon = (minlon + maxlon) / 2;
  let midlat = (minlat + maxlat) / 2;
  console.log(midlon, midlat);

  let trackCentre = `POINT (${midlon} ${midlat})`;
  const sql_ctr = `update route set centre = $1
      where route_name =$2 and users_id = (SELECT id from users where name = $3)`;
  await pgClient.query(sql_ctr, [
    trackCentre,
    routeObj.routeName,
    routeObj.uploader,
  ]);
}
}

// insertroute(route1);
insertroute(route2);
// insertroute(route3);
// insertroute(route4);
// insertroute(route5);
// main();
