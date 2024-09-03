import express from "express";
import { Request, Response } from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import expressSession from "express-session";
import { isLoggedIn } from "./guard";
import { checkPassword, hashPassword } from "./hash";
import formidable from 'formidable'
import fs from 'fs';
import parseCustomRoute from "./utils/parseCustomRoute"

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
    "SELECT ST_AsText(point_coordinates) as point FROM water_dispenser ;"
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
  
  for (let element of resultArr){
    let pointcoord = element.point.replace("POINT(","").replace(")","")
    linestring = linestring + pointcoord + ","
  }
  linestring = linestring.substring(0, linestring.length - 1)
  linestring = 'LINESTRING(' + linestring + ")";
  let linestringObj = { path : linestring}
  let linestringArr = [linestringObj]

  res.json({ data: linestringArr });
});

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
      plainPassword:password ,
      hashedPassword: hashPassword
    })
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

const uploadDir = 'data'
fs.mkdirSync(uploadDir, { recursive: true })

app.use(express.urlencoded({ extended: true }))

app.post("/uploadroute", async function (req: Request, res: Response) {

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    // maxFiles: 1,
    // maxFileSize: 200 * 1024, // the default limit is 200KB
    // filter: part => part.mimetype?.startsWith('image/') || false,
  })

  console.log(req.session)
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
    console.log(routeObj)
    await parseCustomRoute(routeObj)
    return res.json({ message: "uploaded" });
  } catch {
    return res.json({ message: "data error" })
  }
});

//============================for uploading: end of code
//===========================


//===========================CODE FOR SEARCH

app.post("/search", async function (req: Request, res: Response) {

  console.log(req.session)
  try {
  let { startDistricts, endDistricts, isRoads } = req.body

  startDistricts = startDistricts.map((name:string)=>"'"+name+"'").join(",")
  startDistricts = "("+startDistricts+")"
  console.log(startDistricts)

  const sql = `SELECT id, route_name from route 
  where star_district_id IN (SELECT id from district WHERE name IN ${startDistricts})`

  const result = await pgClient.query(sql)
  let suitableRoute = result.rows
  let routes 
  console.log(suitableRoute)

    return res.json({ message: "see the search results: " + suitableRoute, routes: suitableRoute });
  } catch {
    return res.json({ message: "data error" })
  }
});

//============================CODE FOR SEARCH END


app.get("/getRouteDetails", async (req: Request, res: Response) => {
  const data = req.query;
  const route_id = data.routeId;
  // console.log(data);

  const sql = 
  `SELECT users.name AS users_name, route_name, description, distance, duration, view_count, route.created_at, star_district.name AS start_district, end_district.name AS end_district
FROM route INNER JOIN users ON route.users_id =users.id 
INNER JOIN district AS star_district ON route.star_district_id= star_district.id 
INNER JOIN district AS end_district ON route.end_district_id= end_district.id 
WHERE route.id = $1;`
  const result = await pgClient.query(sql, [route_id])
  const row = result.rows[0]
  // console.log(row);
  res.json({row});
});

app.get("/getAllComment", async (req: Request, res: Response) => {
  const data = req.query;
  const route_id = data.routeId;
  // console.log(data);
  
  const getsql = `SELECT users.name, content FROM comment INNER JOIN users ON comment.users_id = users.id WHERE route_id =$1`
  const getresult= await pgClient.query(getsql, [route_id]) 
  const row = getresult.rows
  // console.log(row);

  res.json({row});
});

app.post("/comment", async (req: Request, res: Response) => {  
  if (req.session.userId == undefined) {
    res.status(500).json({message: "Please login first."})
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
  
    const getsql = `SELECT users.name, content FROM comment INNER JOIN users ON comment.users_id = users.id WHERE route_id =$1;`
    const getresult= await pgClient.query(getsql, [route_id]) 
    const row = getresult.rows
    // console.log(row);
    
    res.json({row});
  }
  
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


app.get("/bookmark", async (req: Request, res: Response) => {
  const data = req.query;
  const users_id = req.session.userId;
  const route_id = data.routeId;
  
  const sql = `SELECT * FROM bookmark WHERE users_id = $1 AND route_id = $2;`;
  const result = await pgClient.query(sql,[users_id,route_id]);
  if (result.rowCount != null && result.rowCount > 0) {
    res.json({isBookmarked: true});
  } else {
    res.json({isBookmarked: false});
  }
});

app.post("/bookmark", async (req: Request, res: Response) => {
  if (req.session.userId == undefined) {
    res.status(500).json({message: "Please login first."})
  } else {
    const data = req.body;
    const users_id = req.session.userId;
    const route_id = data.routeId;
    // console.log(users_id);
    // console.log(route_id);
    
    const sql = `INSERT INTO bookmark (users_id, route_id) VALUES ($1,$2);`
    const result = await pgClient.query(sql,[users_id,route_id]);
    // console.log(result);

    res.json({message:"bookmark success"});
  }
});

app.delete("/bookmark", async (req: Request, res: Response) => {
  const data = req.body;
  const users_id = req.session.userId;
  const route_id = data.routeId;
  // console.log(users_id);
  // console.log(route_id);
  
  const sql = `DELETE FROM bookmark WHERE route_id = $1 AND users_id = $2;`
  const result = await pgClient.query(sql,[route_id, users_id]);
  // console.log(result);

  res.json({message:"bookmark deleted"});

});
app.get("/profile", async function (req: Request, res: Response) {
  if (req.session.userId == undefined) {
    res.status(400).json({message: "Please login first."})
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


app.get("/profileBookmark", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  // console.log("hihhi",userId);
  
  const sql = ` SELECT route.id, route_name,description,view_count,centre,json_agg(ST_AsText(path_info.location)) as path from route JOIN path_info on route.id = path_info.route_id JOIN bookmark on bookmark.route_id = route.id WHERE bookmark.users_id = $1 GROUP BY route.id `;
  // const sql = `SELECT route_name, description, view_count FROM route INNER JOIN bookmark ON bookmark.route_id = route.id WHERE bookmark.users_id = $1`
  const result = await pgClient.query(sql,[userId]);
  // console.log(result);
  const row = result.rows;
  // console.log(row);
  
  if (result.rowCount != null && result.rowCount > 0) {
    res.json({ message: "profilebookmark", row});
  } else {
    res.json({ message: "You Don't Have Any Bookmark Route"});
  }
});

app.get("/showAllRoute", async function (req: Request, res: Response) {
  const sql = ` SELECT route.id, route_name,description,view_count,centre,json_agg(ST_AsText(path_info.location)) as path from route JOIN path_info on route.id = path_info.route_id GROUP BY route.id `;
  const result = await pgClient.query(sql);
  console.log(result);
  const row = result.rows;
  // console.log(row);

  res.json({row});
});

app.get("/logout", async function (req: Request, res: Response) {
  if (req.session.userId) {
    req.session.destroy(() => {
      
      res.json({message:"logout"})
    });
  } else {
    res.json({message:"you haven't login"})
  }
  })

app.use(express.static("public"));
app.use(isLoggedIn, express.static("private"));

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/route.html`);
});
