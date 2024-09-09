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

// let createdDate = new Date();
// createdDate = moment(createdDate.getTime()).format("YYYY-MM-DD");

var gpx = new gpxParser(); //Create gpxParser Object

let route1 = {
  filepath: "Tung_Chung.gpx",
  routeName: "東涌炮台",
  description: "有段路望到而家填緊海嘅地方",
  startDistrict: "Islands",
  endDistrict: "Islands",
  uploader: "admin1",
  durationTemp: 0,
  isRoad: true,
  isPublic: false,
};

let route2 = {
  filepath: "2023-01-23-150805.gpx",
  routeName: "屯門青山公路",
  description: "轉車站附近很適合看日落，但今天很曬",
  startDistrict: "Tuen Mun",
  endDistrict: "Tsuen Wan",
  uploader: "admin5",
  durationTemp: 0,
  isRoad: false,
  isPublic: true,
};

let route3 = {
  filepath: "Yuen_Long.gpx",
  routeName: "元朗-南生圍-錦繡花園-上水",
  description: "錦田附近很多魚塘很美",
  startDistrict: "Yuen Long",
  endDistrict: "North",
  uploader: "admin",
  durationTemp: 0,
  isRoad: false,
  isPublic: true,
};

let route4 = {
  filepath: "Tsuen_Wan.gpx",
  routeName: "荃灣海濱",
  description: "荃灣海濱路徑短，風景美",
  startDistrict: "Tsuen Wan",
  endDistrict: "Tsuen Wan",
  uploader: "admin",
  durationTemp: 0,
  isRoad: true,
  isPublic: true,
};

let route5 = {
  filepath: "small_round.gpx",
  routeName: "深水埗-錦田-大圍",
  description: "去到錦田小歇一會，食左一餐巴基斯坦咖哩",
  startDistrict: "Sham Shui Po",
  endDistrict: "Sha Tin",
  uploader: "admin",
  durationTemp: 0,
  isRoad: true,
  isPublic: false,
};

let route6 = {
  filepath: "NgauChiWan-KowloonPeak.gpx",
  routeName: "飛鵝山繞圈路線",
  description: "第一條的山路",
  startDistrict: "Wong Tai Sin",
  endDistrict: "Wong Tai Sin",
  uploader: "admin5",
  durationTemp: 0,
  isRoad: false,
  isPublic: true,
};

let route7 = {
  filepath: "Mount_Parker.gpx",
  routeName: "畢拉山及柏架山",
  description: "港島也可以好好踩",
  startDistrict: "Eastern",
  endDistrict: "Eastern",
  uploader: "admin5",
  durationTemp: 0,
  isRoad: false,
  isPublic: false,
};

let route8 = {
  filepath: "SSP_to_TSW_route.gpx",
  routeName: "深水埗至天水圍",
  description: "深入不毛",
  startDistrict: "Sham Shui Po",
  endDistrict: "Yuen Long",
  uploader: "admin",
  durationTemp: 0,
  isRoad: true,
  isPublic: true,
};

let route9 = {
  filepath: "WTS_short_ride_2.gpx",
  routeName: "天馬苑直落沙田坳",
  description: "斜路直落",
  startDistrict: "Wong Tai Sin",
  endDistrict: "Wong Tai Sin",
  uploader: "admin1",
  durationTemp: 0,
  isRoad: true,
  isPublic: true,
};

let route10 = {
  filepath: "Through_Tai_Lam.gpx",
  routeName: "荃灣海濱-大欖水塘-元朗大棠",
  description: "我直入元朗你卻在大排檔",
  startDistrict: "Tsuen Wan",
  endDistrict: "Yuen Long",
  uploader: "admin",
  durationTemp: 0,
  isRoad: false,
  isPublic: true,
};

let route11 = {
  filepath: "Through_Tai_Lam.gpx",
  routeName: "荃灣海濱-大欖水塘-元朗大棠",
  description: "我直入元朗你卻在大排檔",
  startDistrict: "Tsuen Wan",
  endDistrict: "Yuen Long",
  uploader: "admin",
  durationTemp: 0,
  isRoad: false,
  isPublic: true,
}

let route12 = {
  filepath: "烏溪沙-萬宜.gpx",
  routeName: "烏溪沙-萬宜",
  description: "現在夏季，騎到萬宜，太陽仍然高掛，天仍未黑，我們可以慢慢拍照，直至快要入黑才回程。",
  startDistrict: "Sha Tin",
  endDistrict: "Sai Kung",
  uploader: "admin",
  durationTemp: 0,
  isRoad: true,
  isPublic: true,
}

let route13 = {
  filepath: "HongHum_TKO_LamTin.gpx",
  routeName: "紅磡-將軍澳-茶果嶺",
  description: "上山落山上山又落山",
  startDistrict: "Kowloon City",
  endDistrict: "Kwun Tong",
  uploader: "admin",
  durationTemp: 0,
  isRoad: true,
  isPublic: true,
}


function GFG_Fun(theDate) {
  let date = new Date(theDate);
  return (
    "TIMESTAMP '" +
    date.toISOString().split("T")[0] +
    " " +
    date.toTimeString().split(" ")[0] +
    "'"
  );
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

async function insertroute(routeObj) {
  // const path = require("path");
  let path = "./data/" + routeObj.filepath;
  let data = await fs.promises.readFile(path, "utf8"); //import the gpx file as string
  gpx.parse(data);
  console.log(gpx.tracks[gpx.tracks.length - 1].name);
  console.log(gpx.metadata.time);
  console.log("=============");

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
    console.log(typeof recordTime + ": " + recordTime);
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

  const sql_find = `SELECT * FROM route where route_name = '${routeObj.routeName}' and users_id = (SELECT id from users where name = '${routeObj.uploader}')`;
  const coincideSearch = await pgClient.query(sql_find);
  console.log(coincideSearch.rows.length);
  if (coincideSearch.rows.length == 0) {
    const sql_1 = `INSERT INTO
        route (users_id, route_name, description, star_district_id, end_district_id, road_bicyle_track,
        distance, duration, view_count, public_private, created_at)
    VALUES
        ((SELECT id from users where name ='${routeObj.uploader}'), '${routeObj.routeName}', '${routeObj.description}', (SELECT id from district where name ='${routeObj.startDistrict}'),(SELECT id from district where name ='${routeObj.endDistrict}'), ${routeObj.isRoad}, ${totalDistance}, ${duration}, 0, ${routeObj.isPublic}, ${recordTime})`;
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
    let latDiff = measure(minlat, minlon, maxlat, maxlon);
    const sql_ctr = `update route set centre = $1, lat_diff = $2
      where route_name = $3 and users_id = (SELECT id from users where name = $4)`;
    await pgClient.query(sql_ctr, [trackCentre, latDiff, routeObj.routeName, routeObj.uploader]);  
  }
}

async function main() {
  await insertroute(route1);
  await insertroute(route2);
  await insertroute(route3);
  await insertroute(route4);
  await insertroute(route5);
  await insertroute(route6);
  await insertroute(route7);
  await insertroute(route8);
  await insertroute(route9);
  await insertroute(route10);
  await insertroute(route11);
  await insertroute(route12);
  await insertroute(route13);
  // await insertroute(route14);
  // await insertroute(route15);
  pgClient.end();
}

main();
