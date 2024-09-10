import { Router, Response, Request } from "express";
import { pgClient } from "../main";

export const govDataRouter = Router();

govDataRouter.get("/bicycle_route", getAllBicycleRoutes);
govDataRouter.get("/slope", getAllSlopes);

async function getAllBicycleRoutes(req: Request, res: Response) {
  let queryResult = await pgClient.query(
    "SELECT ST_AsText(path_coordinates) as path FROM bicycle_track ;"
  );

  // console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
}

async function getAllSlopes(req: Request, res: Response) {
  let queryResult = await pgClient.query(
    "SELECT ST_AsText(path_coordinates) as path FROM slope ;"
  );

  // console.log(queryResult.rows);

  res.json({ data: queryResult.rows });
}

// app.get("/parking", async (req: Request, res: Response) => {
//   let queryResult = await pgClient.query(
//     "SELECT ST_AsText(point_coordinates) as point FROM parking ;"
//   );

//   // console.log(queryResult.rows);

//   res.json({ data: queryResult.rows });
// });

// app.get("/water_dispenser", async (req: Request, res: Response) => {
//   let queryResult = await pgClient.query(
//     "SELECT facility, location_detail as locationDetail,ST_AsText(point_coordinates) as point FROM water_dispenser ;"
//   );

//   // console.log(queryResult.rows);

//   res.json({ data: queryResult.rows });
// });

// app.get("/customroute", async (req: Request, res: Response) => {
//   let queryResult = await pgClient.query(
//     "SELECT route_id as routeId, ST_AsText(location) as point FROM path_info ;"
//   );

//   let linestring = "";
//   let resultArr = queryResult.rows;

//   for (let element of resultArr) {
//     let pointcoord = element.point.replace("POINT(", "").replace(")", "");
//     linestring = linestring + pointcoord + ",";
//   }
//   linestring = linestring.substring(0, linestring.length - 1);
//   linestring = "LINESTRING(" + linestring + ")";
//   let linestringObj = { path: linestring };
//   let linestringArr = [linestringObj];

//   res.json({ data: linestringArr });
// });
