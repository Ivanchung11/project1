const fs = require("fs");
const { Client } = require("pg");
const tj = require("@tmcw/togeojson");
const { DOMParser } = require("xmldom");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
console.log(process.env.DB_NAME);
// PostgreSQL connection details (user and password left empty)
const client = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

client.connect();

async function parseKML(kmlFileName, dbTable) {
  // Define the correct path to your KML file
  const kmlFilePath = path.join(__dirname, kmlFileName);

  // Read and parse the KML file
  let result = await fs.promises.readFile(kmlFilePath, "utf8");

  // Parse the KML file into a DOM
  const kmlDom = await new DOMParser().parseFromString(result, "text/xml");

  // Convert the KML DOM into GeoJSON
  const geojson = await tj.kml(kmlDom);

  // console.log(geojson);
  // Log the GeoJSON output to understand its structure
  // console.log(JSON.stringify(geojson, null, 2));

  if (geojson.features[0].geometry.type == "LineString") {
    await storeString(geojson, dbTable);
  } else if (geojson.features[0].geometry.type == "Point") {
    await storePoint(geojson, dbTable);
  }
}

async function storeString(geojson, dbTable) {
  // Filter out all the LineString features
  const lineStrings = geojson.features.filter(
    (feature) => feature.geometry.type === "LineString"
  );

  if (lineStrings.length > 0) {
    let index = 0;
    for (let lineString of lineStrings) {
      // Convert the GeoJSON coordinates to WKT format for insertion into PostGIS
      const coordinates = lineString.geometry.coordinates
        .map((coord) => `${coord[0]} ${coord[1]}`)
        .join(",");

      const wktLineString = `LINESTRING(${coordinates})`;

      // Insert into PostgreSQL
      const query = `
        INSERT INTO ${dbTable} (path_coordinates)
        VALUES (ST_GeogFromText($1))
      `;
      const values = [wktLineString];

      await client.query(query, values);
      console.log(
        `Data inserted (for kml string) successfully for route ${index + 1}`
      );
    }
  } else {
    console.error("No LineString found in the KML file.");
    // client.end();
  }
}

async function storePoint(geojson, dbTable) {
  const points = geojson.features.filter(
    (feature) => feature.geometry.type === "Point"
  );

  if (points.length > 0) {
    let index = 0;
    for (let point of points) {
      // Convert the GeoJSON coordinates to WKT format for insertion into PostGIS
      const coord = point.geometry.coordinates;
      const wktPoint = `POINT(${coord[0]} ${coord[1]})`;

      // Insert into PostgreSQL
      const query = `
      INSERT INTO ${dbTable} (point_coordinates)
      VALUES (ST_GeogFromText($1))
      `;
      const values = [wktPoint];
      console.log("inserting points");
      await client.query(query, values);
      console.log(
        `Data inserted (for kml point) successfully for point ${index + 1}`
      );
    }
  } else {
    console.error("No Point found in the KML file.");
    client.end();
  }
}

async function main() {
  await parseKML("../data/CYCPARKSPACE.kml", "parking");
  await parseKML("../data/CYCRAMP.kml", "slope");
  await parseKML("../data/CYCTRACK.kml", "bicycle_track");
  client.end();
}

main();
