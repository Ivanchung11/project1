import express from "express";
import { Request, Response } from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import expressSession from "express-session";
import { isLoggedIn } from "./guard";

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
  console.log(resultArr);
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
  VALUES ('${username}', '${password}', '${email}' );`;
  console.log(sql);
  
  const InsertResult = await pgClient.query(sql);
  
  res.json({ message: "register success" });
});



app.post("/login", async (req: Request, res: Response) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  const sql = `select * from users where name = '${username}' and password = '${password}';`;
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

app.get("/getAllComment", async (req: Request, res: Response) => {
  const data = req.query;
  const route_id = data.routeId;
  console.log(data);
  
  const getsql = `SELECT users.name, content FROM comment INNER JOIN users ON comment.users_id = users.id WHERE route_id =$1`
  const getresult= await pgClient.query(getsql, [route_id]) 
  const row = getresult.rows
  console.log(row);

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
    console.log(row);
    
    res.json({row});
  }
  
});

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
  const data = req.body;
  const users_id = req.session.userId;
  const route_id = data.routeId;
  console.log(users_id);
  console.log(route_id);
  
  const sql = `INSERT INTO bookmark (users_id, route_id) VALUES ($1,$2);`
  const result = await pgClient.query(sql,[users_id,route_id]);
  // console.log(result);

  res.json({message:"bookmark success"});

});

app.delete("/bookmark", async (req: Request, res: Response) => {
  const data = req.body;
  const users_id = req.session.userId;
  const route_id = data.routeId;
  console.log(users_id);
  console.log(route_id);
  
  const sql = `DELETE FROM bookmark WHERE route_id = $1 AND users_id = $2;`
  const result = await pgClient.query(sql,[route_id, users_id]);
  // console.log(result);

  res.json({message:"bookmark deleted"});

});
app.get("/profile", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  const sql = `SELECT id, name FROM users WHERE id = $1`;
  const result = await pgClient.query(sql, [userId]);
  const row = result.rows[0];
  console.log(row);

  res.json({ message: "profile", row });
});

app.get("/profileBookmark", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  console.log(userId);
  
  // const sql = ` select users.name, route_id, created_at from bookmark inner JOIN users ON bookmark.users_id = users.id where users_id = $1`;
  const sql = `SELECT * FROM route INNER JOIN bookmark ON bookmark.route_id = route.id`
  const result = await pgClient.query(sql, [userId]);
  const row = result.rows;
  console.log(row);

  // res.json({ message: "profile", row });
});

app.get("/logout", async function (req: Request, res: Response) {
  if (req.session.userId) {
    req.session.destroy(() => {
      
      res.json({message:"logout"})
    });
  } else {
    res.status(400).json({message:"you haven't login"})
  }
  })

app.use(express.static("public"));
app.use(isLoggedIn, express.static("private"));

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/route.html`);
});
