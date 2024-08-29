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

  console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
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
  res.json({
    message: "Login successful",
    nickname: row.nickname,
    userId: req.session.userId,
  });
  return;

  // console.log(resultData);

  // res.json({message:"login success",username:username,password:password})
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

app.get("/profile", async function (req: Request, res: Response) {
  const userId = req.session.userId;
  const sql = `select id, name from users where id = $1`;
  const result = await pgClient.query(sql, [userId]);
  const row = result.rows[0];
  console.log(row);

  res.json({ message: "profile", row });
});

app.use(express.static("public"));
app.use(isLoggedIn, express.static("private"));

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/route.html`);
});
