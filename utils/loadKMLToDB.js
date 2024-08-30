const fs = require("fs");
const { Client } = require("pg");
const tj = require("@tmcw/togeojson");
const { DOMParser } = require("xmldom");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// PostgreSQL connection details (user and password left empty)
const client = new Client({
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

client.connect();


// ========== for bicycle track ==========
// Define the correct path to your KML file
const kmlFilePath = path.join(__dirname, "../data/CYCTRACK.kml");

// Read and parse the KML file
fs.readFile(kmlFilePath, "utf8", (err, data) => {
  if (err) throw err;

  // Parse the KML file into a DOM
  const kmlDom = new DOMParser().parseFromString(data, "text/xml");

  // Convert the KML DOM into GeoJSON
  const geojson = tj.kml(kmlDom);

  // Log the GeoJSON output to understand its structure
  // console.log(JSON.stringify(geojson, null, 2));

  // Filter out all the LineString features
  const lineStrings = geojson.features.filter(
    (feature) => feature.geometry.type === "LineString"
  );

  if (lineStrings.length > 0) {
    lineStrings.forEach((lineString, index) => {
      // Convert the GeoJSON coordinates to WKT format for insertion into PostGIS
      const coordinates = lineString.geometry.coordinates
        .map((coord) => `${coord[0]} ${coord[1]}`)
        .join(",");

      const wktLineString = `LINESTRING(${coordinates})`;

      // Insert into PostgreSQL
      const query = `
        INSERT INTO bicycle_track (path_coordinates)
        VALUES (ST_GeogFromText($1))
      `;
      const values = [wktLineString];

      client.query(query, values, (err, res) => {
        if (err) {
          console.error("Error inserting data:", err.stack);
        } else {
          // console.log(`Data inserted successfully for route ${index + 1}`);
        }
      });
    });
  } else {
    console.error("No LineString found in the KML file.");
    client.end();
  }
});



// ========== for slopes ==========
// Define the correct path to your KML file
const slopekmlFilePath = path.join(__dirname, "../data/CYCRAMP.kml");

// Read and parse the KML file
fs.readFile(slopekmlFilePath, "utf8", (err, data) => {
  if (err) throw err;

  // Parse the KML file into a DOM
  const kmlDom = new DOMParser().parseFromString(data, "text/xml");

  // Convert the KML DOM into GeoJSON
  const geojson = tj.kml(kmlDom);

  // Log the GeoJSON output to understand its structure
  // console.log(JSON.stringify(geojson, null, 2));

  // Filter out all the LineString features
  const lineStrings = geojson.features.filter(
    (feature) => feature.geometry.type === "LineString"
  );

  if (lineStrings.length > 0) {
    lineStrings.forEach((lineString, index) => {
      // Convert the GeoJSON coordinates to WKT format for insertion into PostGIS
      const coordinates = lineString.geometry.coordinates
        .map((coord) => `${coord[0]} ${coord[1]}`)
        .join(",");

      const wktLineString = `LINESTRING(${coordinates})`;

      // Insert into PostgreSQL
      const query = `
        INSERT INTO slope (path_coordinates)
        VALUES (ST_GeogFromText($1))
      `;
      const values = [wktLineString];

      client.query(query, values, (err, res) => {
        if (err) {
          console.error("Error inserting data:", err.stack);
        } else {
          // console.log(`Data inserted successfully for route ${index + 1}`);
        }
      });
    });
  } else {
    console.error("No LineString found in the KML file.");
    client.end();
  }
});



// ========== for parkings ==========
// Define the correct path to your KML file
const parkingsKmlFilePath = path.join(__dirname, "../data/CYCPARKSPACE.kml");

// Read and parse the KML file
fs.readFile(parkingsKmlFilePath, "utf8", (err, data) => {
  if (err) throw err;

  // Parse the KML file into a DOM
  const kmlDom = new DOMParser().parseFromString(data, "text/xml");

  // Convert the KML DOM into GeoJSON
  const geojson = tj.kml(kmlDom);

  // Log the GeoJSON output to understand its structure
  // console.log(JSON.stringify(geojson, null, 2));

  // Filter out all the LineString features
  const points = geojson.features.filter(
    (feature) => feature.geometry.type === "Point"
  );

  if (points.length > 0) {
    points.forEach((point, index) => {
      // Convert the GeoJSON coordinates to WKT format for insertion into PostGIS
      const coord = point.geometry.coordinates
      const wktPoint = `POINT(${coord[0]} ${coord[1]})`;
      
      // Insert into PostgreSQL
      const query = `
      INSERT INTO parking (point_coordinates)
      VALUES (ST_GeogFromText($1))
      `;
      const values = [wktPoint];
      
      client.query(query, values, (err, res) => {
        if (err) {
          console.error("Error inserting data:", err.stack);
        } else {
          // console.log(`Data inserted successfully for route ${index + 1}`);
        }
      });
    });
  } else {
    console.error("No Point found in the KML file.");
    client.end();
  }
});


