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
// PostgreSQL connection details (user and password left empty)
const pgClient = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pgClient.connect();

// let createdDate = new Date();
// createdDate = moment(createdDate.getTime()).format("YYYY-MM-DD");

var gpx = new gpxParser(); //Create gpxParser Object

function GFG_Fun(theDate: string): string {
  let date = new Date(theDate);
  return (
    "TIMESTAMP '" +
    date.toISOString().split("T")[0] +
    " " +
    date.toTimeString().split(" ")[0] +
    "'"
  );
}

export async function insertroute(routeObj: any) {
  let path = "./data/" + routeObj.filepath;
  let data = await fs.promises.readFile(path, "utf8"); //import the gpx file as string
  gpx.parse(data);
  // console.log("Meta: ", gpx.metadata);
  // console.log("Time: ", gpx.metadata.time);
  // console.log("Trackname: ", gpx.tracks[gpx.tracks.length - 1].name);
  // console.log("=============");

  var distanceArr = gpx.tracks[gpx.tracks.length - 1].distance;
  var totalDistance = distanceArr.total;
  var geopoints = gpx.tracks[gpx.tracks.length - 1].points;

  let recordTime = "";
  if (gpx.metadata.time) {
    recordTime = gpx.metadata.time;
  } else if (geopoints[0].time) {
    recordTime = geopoints[0].time;
  }

  if (recordTime != "") {
    recordTime = GFG_Fun(recordTime);
  }

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
  } else if (routeObj.durationTemp) {
    duration = routeObj.durationTemp;
  }

  console.log(routeObj);
  
  let sql_alluser = `SELECT name from users`;
  let allUsername = await pgClient.query(sql_alluser);
  console.log(allUsername);

  let sql_user = `SELECT name from users where id = $1`;
  console.log(routeObj.uploaderId);
  let username = await pgClient.query(sql_user, [routeObj.uploaderId]);
  console.log(routeObj.uploaderId, "  ", username);

  username = username.rows[0].name;

  let sql_find = `SELECT * FROM route where route_name = $1 and users_id = (SELECT id from users where name = $2)`;
  let coincideSearch = await pgClient.query(sql_find, [
    routeObj.routeName,
    username,
  ]);

  console.log([routeObj.routeName, username], coincideSearch.rows);

  if (coincideSearch.rows.length == 0) {
    const sql_1 = `INSERT INTO
        route (users_id, route_name, description, star_district_id, end_district_id, road_bicyle_track,
        distance, duration, view_count, public_private, created_at)
    VALUES
        ((SELECT id from users where name ='${username}'), '${routeObj.routeName}', '${routeObj.description}', (SELECT id from district where name ='${routeObj.startDistrict}'),(SELECT id from district where name ='${routeObj.endDistrict}'), ${routeObj.isRoad}, ${totalDistance}, ${duration}, 0, ${routeObj.isPublic}, ${recordTime})`;
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

      const sqlWhat = `SELECT id from route where route_name ='${routeObj.routeName}'`;
      const whatResult = await pgClient.query(sqlWhat);
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
    let latDiff = maxlat - minlat;
    const sql_ctr = `update route set centre = $1, lat_diff = $2
      where route_name = $3 and users_id = (SELECT id from users where name = $4)`;
    await pgClient.query(sql_ctr, [trackCentre, latDiff, routeObj.routeName, username]);
  }
}

export default async function main(routeObj: any) {
  
  await insertroute(routeObj);
  // await pgClient.end();
}
