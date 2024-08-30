const fs = require("fs");
const jsonfile = require("jsonfile");
const path = require("path");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();
console.log(process.env.DB_NAME);

// PostgreSQL connection details 
const client = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

client.connect();


//input waterDispenser JSON and parse it by JSON.parse
let waterDispenserJsonPath = path.join(__dirname, "../data/lcsd_wd_en.json");

let theFile = fs.readFileSync(waterDispenserJsonPath);
theFile = JSON.parse(theFile);
console.log(theFile);


//convert to WKT
const coordinates = theFile.map((point) => {
  return `POINT(${point.Longitude} ${point.Latitude})`;
});
console.log(coordinates);

//save data to sql database
if (coordinates.length > 0) {
  coordinates.forEach((coord, index) => {
    const query = `INSERT INTO water_dispenser (point_coordinates) VALUES (ST_GeogFromText($1))`;
    client.query(query, [coord], (err, res) => {
      if (err) {
        console.error("Error inserting data:", err.stack);
      } else {
        console.log(`Data inserted successfully for route ${index + 1}`);
      }
    });
  });
} else {
  console.error("No Point found in the CSV file.");
  client.end();
}
