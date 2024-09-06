import express from "express";
import { Request, Response } from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import expressSession from "express-session";
import { isLoggedIn } from "./guard";
import { checkPassword, hashPassword } from "./hash";
import formidable from "formidable";
import fs from "fs";
const gpxParser = require("gpxparser");
// import parseCustomRoute from "./utils/parseCustomRoute";

dotenv.config();

const pgClient = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pgClient.connect();

const app = express();
app.use(express.json());

app.use(
  expressSession({
    secret: "kufuykfyukdtydktu8t86rgvyu8t87t78ygi8t78t68",
    resave: true,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

//  =============== route page  ==================

app.get("/bicycle_route", async (req: Request, res: Response) => {
  let queryResult = await pgClient.query(
    "SELECT ST_AsText(path_coordinates) as path FROM bicycle_track ;"
  );

  // console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
});

app.get("/slope", async (req: Request, res: Response) => {
  let queryResult = await pgClient.query(
    "SELECT ST_AsText(path_coordinates) as path FROM slope ;"
  );

  // console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
});

app.get("/parking", async (req: Request, res: Response) => {
  let queryResult = await pgClient.query(
    "SELECT ST_AsText(point_coordinates) as point FROM parking ;"
  );

  // console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
});

app.get("/water_dispenser", async (req: Request, res: Response) => {
  let queryResult = await pgClient.query(
    "SELECT facility, location_detail as locationDetail,ST_AsText(point_coordinates) as point FROM water_dispenser ;"
  );

  // console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
});

app.get("/customroute", async (req: Request, res: Response) => {
  let queryResult = await pgClient.query(
    "SELECT route_id as routeId, ST_AsText(location) as point FROM path_info ;"
  );

  let linestring = "";
  let resultArr = queryResult.rows;

  for (let element of resultArr) {
    let pointcoord = element.point.replace("POINT(", "").replace(")", "");
    linestring = linestring + pointcoord + ",";
  }
  linestring = linestring.substring(0, linestring.length - 1);
  linestring = "LINESTRING(" + linestring + ")";
  let linestringObj = { path: linestring };
  let linestringArr = [linestringObj];

  res.json({ data: linestringArr });
});

app.get("/showAllRoute", async function (req: Request, res: Response) {
  const sql = ` SELECT route.id, route_name,description,view_count,route.public_private,centre,json_agg(ST_AsText(path_info.location)) as path 
  from route JOIN path_info on route.id = path_info.route_id GROUP BY route.id`;
  const result = await pgClient.query(sql);
  // console.log(result);
  const row = result.rows;
  // console.log(row);

  res.json({ row });
});

//  =============== register page ==================

app.post("/register", async function (req: Request, res: Response) {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  const email = data.email;
  const userResult = await pgClient.query(
    `Select * from users where name = '${username}'`
  );
  const row = userResult.rows;
  const rowCount = userResult.rowCount;
  if (rowCount == null || rowCount > 0) {
    res.status(400).json({ message: "username exists in database" });
    return;
  }
  const sql = `INSERT INTO users (name, password, email ) 
  VALUES ('${username}', '${await hashPassword(password)}', '${email}' );`;
  // console.log(sql);

  const InsertResult = await pgClient.query(sql);

  res.json({ message: "register success" });
});

// =============== login page ==================

app.post("/login", async (req: Request, res: Response) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  const sql = `select * from users where name = '${username}';`;
  const result = await pgClient.query(sql);
  const row = result.rows[0];
  const count = result.rowCount;

  // console.log(req.session.userId);

  // console.log(sql);
  // console.log(result);
  // console.log(count);

  if (count == 0) {
    res.status(401).json({ message: "username or password is wrong." });
    return;
  } else {
    const hashPassword = row.password;
    const checkingPassword = await checkPassword({
      plainPassword: password,
      hashedPassword: hashPassword,
    });
    if (!checkingPassword) {
      res.status(401).json({ message: "username or password is wrong." });
      return;
    }
  }
  req.session.userId = row.id;
  // console.log(req.session.userId);
  res.json({
    message: "Login successful",
    nickname: row.nickname,
    userId: req.session.userId,
  });
  return;

  // console.log(resultData);

  // res.json({message:"login success",username:username,password:password})
});

//===========================for uploading

const uploadDir = "data";
fs.mkdirSync(uploadDir, { recursive: true });

app.use(express.urlencoded({ extended: true }));

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

app.post("/uploadroute", async function (req: Request, res: Response) {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    // maxFiles: 1,
    // maxFileSize: 200 * 1024, // the default limit is 200KB
    // filter: part => part.mimetype?.startsWith('image/') || false,
  });

  console.log(req.session);
  try {
    let data = await form.parse(req);
    let routeObj = {
      filepath: data[1].gpx![0].newFilename,
      routeName: data[0].routeName![0],
      description: data[0].description![0],
      startDistrict: data[0].startDistrict![0],
      endDistrict: data[0].endDistrict![0],
      uploaderId: req.session.userId,
      isRoad: data[0].isRoad![0],
      isPublic: data[0].isPublic![0],
      durationTemp: parseInt(data[0].durationTemp![0]),
    };
    // console.log(routeObj);

    let sql_user = `SELECT name from users where id = $1`;
    let username = await pgClient.query(sql_user, [routeObj.uploaderId]);
    username = username.rows[0].name;
    let sql_find = `SELECT * FROM route where route_name = $1 and users_id = (SELECT id from users where name = $2)`;
    let coincideSearch = await pgClient.query(sql_find, [
      routeObj.routeName,
      username,
    ]);
    console.log(coincideSearch.rows.length);

    if (coincideSearch.rows.length != 0) {
      return res.json({ message: "name crashed" });
    } else {
      var gpx = new gpxParser();

      let path = "./data/" + routeObj.filepath;
      let data1 = await fs.promises.readFile(path, "utf8"); //import the gpx file as string
      gpx.parse(data1);

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

        // const sqlWhat = `SELECT id from route where route_name ='${routeObj.routeName}'`;
        // const whatResult = await pgClient.query(sqlWhat);
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
      // console.log(midlon, midlat);

      let trackCentre = `POINT (${midlon} ${midlat})`;
      let latDiff = maxlat - minlat;
      const sql_ctr = `update route set centre = $1, lat_diff = $2
      where route_name = $3 and users_id = (SELECT id from users where name = $4)`;
      await pgClient.query(sql_ctr, [
        trackCentre,
        latDiff,
        routeObj.routeName,
        username,
      ]);

      for (let key in data[1]) {
        if (key.includes("photo")) {
          let imagePath = data[1][key]![0].newFilename;
          let sql = `INSERT INTO photo (route_id, image_path) values ((SELECT id from route where route_name =$1), $2)`;
          await pgClient.query(sql, [routeObj.routeName, imagePath]);
          console.log("photo" + key + "upload.");
        }
      }
      return res.json({ message: "uploaded" });
    }
  } catch {
    return res.json({ message: "data error" });
  }
});

//============================for uploading: end of code
//===========================

//============================
//===========================CODE FOR SEARCH

app.post("/search", async function (req: Request, res: Response) {
  console.log(req.session);
  try {
    let { startDistricts, endDistricts, isRoads } = req.body;

    // let AllDistricts = [
    //   "Central and Western",
    //   "Wan Chai",
    //   "Eastern",
    //   "Southern",
    //   "Yau Tsim Mong",
    //   "Sham Shui Po",
    //   "Kowloon City",
    //   "Wong Tai Sin",
    //   "Kwun Tong",
    //   "Kwai Tsing",
    //   "Tsuen Wan",
    //   "Tuen Mun",
    //   "Yuen Long",
    //   "North",
    //   "Tai Po",
    //   "Sha Tin",
    //   "Sai Kung",
    //   "Islands",
    // ];

    if (startDistricts == null) {
      startDistricts = ["null"];
    }
    if (endDistricts == null) {
      endDistricts = ["null"];
    }
    if (isRoads == null) {
      isRoads = [];
    }

    let arrayToPsqlStr = function (arr: string[]) {
      let str: string = arr.map((name: string) => "'" + name + "'").join(",");
      str = "(" + str + ")";
      return str;
    };

    startDistricts = arrayToPsqlStr(startDistricts);
    endDistricts = arrayToPsqlStr(endDistricts);
    isRoads = arrayToPsqlStr(isRoads);

    console.log(
      "start: ",
      startDistricts,
      "finish: ",
      endDistricts,
      "isRoad: ",
      isRoads
    );

    const sql = `SELECT route.id, route_name, description, view_count, centre, json_agg(ST_AsText(path_info.location)) as path
  from route  JOIN path_info on route.id = path_info.route_id
  where (star_district_id IN (SELECT id from district WHERE name IN ${startDistricts}))
  and (end_district_id IN (SELECT id from district WHERE name IN ${endDistricts}))
  and (road_bicyle_track IN ${isRoads})
  GROUP BY route.id
  `;

    const result = await pgClient.query(sql);
    let row = result.rows;
    console.log(row)
    return res.json({ message: "see the search results: ", row });
  } catch {
    return res.json({ message: "data error" });
  }
});

//============================CODE FOR SEARCH END

// =============== route detail page ==================

app.get("/viewCount", async (req: Request, res: Response) => {
  const data = req.query;
  const route_id = data.routeId;

  const sql = `UPDATE route SET view_count = view_count + 1 WHERE id = $1`;
  const result = await pgClient.query(sql, [route_id]);
  res.json({ message: "view count + 1" });
});

app.get("/getRouteDetails", async (req: Request, res: Response) => {
  const data = req.query;
  const route_id = data.routeId;
  // console.log(data);

  const sql = `SELECT users.name AS users_name, route_name, description, distance, duration, view_count, route.created_at, star_district.name AS start_district, end_district.name AS end_district
FROM route INNER JOIN users ON route.users_id =users.id 
INNER JOIN district AS star_district ON route.star_district_id= star_district.id 
INNER JOIN district AS end_district ON route.end_district_id= end_district.id 
WHERE route.id = $1;`;
  const result = await pgClient.query(sql, [route_id]);
  const row = result.rows[0];
  // console.log(row);

  const photosql = `SELECT image_path from photo where route_id = $1`;
  const photoresult = await pgClient.query(photosql, [route_id]);
  const photorow = photoresult.rows;
  console.log(photorow);

  res.json({ row, photorow });
});

app.get("/getAllComment", async (req: Request, res: Response) => {
  const data = req.query;
  const route_id = data.routeId;
  // console.log(data);

  const getsql = `SELECT users.name, content FROM comment INNER JOIN users ON comment.users_id = users.id WHERE route_id =$1`;
  const getresult = await pgClient.query(getsql, [route_id]);
  const row = getresult.rows;
  // console.log(row);

  res.json({ row });
});

app.post("/comment", async (req: Request, res: Response) => {
  if (req.session.userId == undefined) {
    res.status(500).json({ message: "Please login first." });
  } else {
    const data = req.body;
    const users_id = req.session.userId;
    const route_id = data.routeId;
    const content = data.content;
    // console.log(content);
    // console.log(users_id);
    // console.log(route_id);

    const sql = `INSERT INTO comment (users_id, route_id, content) VALUES ('${users_id}','${route_id}','${content}');`;
    const result = await pgClient.query(sql);
    // console.log(result);

    const getsql = `SELECT users.name, content FROM comment INNER JOIN users ON comment.users_id = users.id WHERE route_id =$1;`;
    const getresult = await pgClient.query(getsql, [route_id]);
    const row = getresult.rows;
    // console.log(row);

    res.json({ row });
  }
});

app.get("/showRouteDetails", async function (req: Request, res: Response) {
  const data = req.query;
  const route_id = data.routeId;
  // console.log(route_id,"ahsghfhjas");
  const centresql = `
  SELECT centre, lat_diff as latdiff FROM route WHERE id = $1`;
  const centreResult = await pgClient.query(centresql, [route_id]);
  const centrePoint = centreResult.rows[0].centre;
  const latDiff = centreResult.rows[0].latdiff;
  console.log(centrePoint, latDiff);
  const sql = `
  SELECT ST_AsText(location) as point FROM path_info WHERE route_id = $1`;
  const result = await pgClient.query(sql, [route_id]);
  let linestring = "";
  let resultArr = result.rows;

  for (let element of resultArr) {
    let pointcoord = element.point.replace("POINT(", "").replace(")", "");
    linestring = linestring + pointcoord + ",";
  }
  // console.log(linestring);

  linestring = linestring.substring(0, linestring.length - 1);
  linestring = "LINESTRING(" + linestring + ")";
  let linestringObj = { path: linestring };
  let linestringArr = [linestringObj];
  // console.log(linestringArr);

  res.json({ row: linestringArr, centrePoint: centrePoint, latDiff: latDiff });
});

// app.get("/follow", async (req: Request, res: Response) => {
//   const follower_id = req.session.userId;
//   const sql = `SELECT users_id , users.name FROM route INNER JOIN users ON users_id = users.id;`;
//   const result = await pgClient.query(sql);
//   const followee_id = result.rows[0].users_id;
//   console.log(followee_id);

//   if (result.rowCount != null && result.rowCount > 0) {
//     res.json({isFollowed: true});
//   } else {
//     res.json({isFollowed: false});
//   }

// });

// app.post("/follow", async (req: Request, res: Response) => {
//   // if (req.session.userId == undefined) {
//   //   res.status(500).json({message: "Please login first."})
//   // } else {
//     const data = req.body;
//     const follower_id = req.session.userId;
//     const getsql = `SELECT users_id , users.name FROM route INNER JOIN users ON users_id = users.id;`;
//     const getresult = await pgClient.query(getsql);
//     const followee_id = getresult.rows[0].users_id;
//     const route_id = data.routeId;
//     console.log(follower_id);
//     console.log(followee_id);
//     console.log(route_id);

//     // const sql = `INSERT INTO bookmark (users_id, route_id) VALUES ($1,$2);`
//     // const result = await pgClient.query(sql,[users_id,route_id]);
//     // console.log(result);

//     res.json({message:"follow success"});
//   // }
// });

// =============== bookmark ==================

app.get("/bookmark", async (req: Request, res: Response) => {
  const data = req.query;
  const users_id = req.session.userId;
  const route_id = data.routeId;

  const sql = `SELECT * FROM bookmark WHERE users_id = $1 AND route_id = $2;`;
  const result = await pgClient.query(sql, [users_id, route_id]);
  if (result.rowCount != null && result.rowCount > 0) {
    res.json({ isBookmarked: true });
  } else {
    res.json({ isBookmarked: false });
  }
});

app.post("/bookmark", async (req: Request, res: Response) => {
  if (req.session.userId == undefined) {
    res.status(500).json({ message: "Please login first." });
  } else {
    const data = req.body;
    const users_id = req.session.userId;
    const route_id = data.routeId;
    // console.log(users_id);
    // console.log(route_id);

    const sql = `INSERT INTO bookmark (users_id, route_id) VALUES ($1,$2);`;
    const result = await pgClient.query(sql, [users_id, route_id]);
    // console.log(result);

    res.json({ message: "bookmark success" });
  }
});

app.delete("/bookmark", async (req: Request, res: Response) => {
  const data = req.body;
  const users_id = req.session.userId;
  const route_id = data.routeId;
  // console.log(users_id);
  // console.log(route_id);

  const sql = `DELETE FROM bookmark WHERE route_id = $1 AND users_id = $2;`;
  const result = await pgClient.query(sql, [route_id, users_id]);
  // console.log(result);

  res.json({ message: "bookmark deleted" });
});

// =============== profile page ==================

app.get("/profile", async function (req: Request, res: Response) {
  if (req.session.userId == undefined) {
    res.status(200).json({ message: "Please login first." });
  } else {
    const userId = req.session.userId;
    // console.log("hahahaaaa",userId);

    const sql = `SELECT id, name FROM users WHERE id = $1`;
    const result = await pgClient.query(sql, [userId]);
    const row = result.rows[0];
    // console.log(row);

    res.json({ message: "profile", row });
  }
});

app.get("/recentRecords", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  // console.log("hihhi",userId);

  const sql = ` 
  SELECT route.id, route_name,description,view_count,centre,json_agg(ST_AsText(path_info.location)) as path 
  from route JOIN path_info on route.id = path_info.route_id 
  JOIN users on route.users_id = users.id WHERE users.id = $1 GROUP BY route.id`;
  const result = await pgClient.query(sql, [userId]);
  const row = result.rows;
  res.json({ row });
});

app.get("/profileBookmark", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  // console.log("hihhi",userId);

  const sql = ` SELECT route.id, route_name,description,view_count,centre,json_agg(ST_AsText(path_info.location)) as path from route JOIN path_info on route.id = path_info.route_id JOIN bookmark on bookmark.route_id = route.id WHERE bookmark.users_id = $1 GROUP BY route.id `;
  // const sql = `SELECT route_name, description, view_count FROM route INNER JOIN bookmark ON bookmark.route_id = route.id WHERE bookmark.users_id = $1`
  const result = await pgClient.query(sql, [userId]);
  // console.log(result);
  const row = result.rows;
  // console.log(row);

  if (result.rowCount != null && result.rowCount > 0) {
    res.json({ message: "profilebookmark", row });
  } else {
    res.json({ message: "You Don't Have Any Bookmark Route" });
  }
});

app.get("/profilePhoto", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  // console.log("hihhi",userId);

  const sql = `SELECT image_path, route_id from photo where route_id IN (SELECT id from route where (users_id = $1))`;
  // const sql = `SELECT route_name, description, view_count FROM route INNER JOIN bookmark ON bookmark.route_id = route.id WHERE bookmark.users_id = $1`
  const result = await pgClient.query(sql, [userId]);
  // console.log(result);
  const row = result.rows;
  // console.log(row);

  if (result.rowCount != null && result.rowCount > 0) {
    res.json({ message: "profilephoto", row });
  } else {
    res.json({ message: "You Don't Have Any Photo" });
  }
});

// =============== logout button ==================

app.get("/logout", async function (req: Request, res: Response) {
  if (req.session.userId) {
    req.session.destroy(() => {
      res.json({ message: "logout" });
    });
  } else {
    res.json({ message: "you haven't login" });
  }
});

app.use("/data", express.static("data"));
app.use(express.static("public"));
app.use(isLoggedIn, express.static("private"));

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/index.html`);
});
