const fs = require("fs");
// const jsonfile = require("jsonfile");
const path = require("path");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();
// console.log(process.env.DB_NAME);

// PostgreSQL connection details
const client = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

client.connect();

async function parseJsonPoint(jsonpath, dbTable) {
  let theFilePath = path.join(__dirname, jsonpath);

  let theFile = await fs.promises.readFile(theFilePath, "utf8");

  theFile = await JSON.parse(theFile);

  //convert to WKT
  const coordinates = theFile.map((point) => {
    return `POINT(${point.Longitude.trim()} ${point.Latitude.trim()})`;
  });

  //save data to sql database
  if (coordinates.length > 0) {
    for (let i = 0; i < coordinates.length; i++) {
      const query = `INSERT INTO ${dbTable} (point_coordinates) VALUES (ST_GeogFromText($1))`;
      await client.query(query, [coordinates[i]]);
      console.log(i + 1, "th uploaded", coordinates[i]);
    }
  } else {
    console.error("No Point found in the CSV file.");
    client.end();
  }
}
//input waterDispenser JSON and parse it by JSON.parse

// client.end()
async function main() {
  await parseJsonPoint("../data/lcsd_wd_en.json", "water_dispenser");
  client.end();
}

main();
// "../data/lcsd_wd_en.json"
