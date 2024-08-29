// Initialize and add the map
let map;
let customLayer;
let SlopeLayer;
let toggleControl;

function parseWKTLineString(wkt) {
  const matches = wkt.match(/LINESTRING\s*\(([^)]+)\)/);
  if (!matches) return [];
  const coordinatesString = matches[1];
  const coordinates = coordinatesString.split(",").map((coord) => {
    const [lng, lat] = coord.trim().split(" ").map(Number);
    return { lat, lng };
  });
  return coordinates;
}

// Create a custom control button
function createControlUI(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.marginTop = "22px";
  controlUI.style.textAlign = "center";
  controlUI.innerHTML = "Toggle Cycling Track";

  return controlUI;
}

// Create a custom control button slope =================================
function createControlSlope(map) {
  const controlSlope = document.createElement("button");

  controlSlope.style.backgroundColor = "#fff";
  controlSlope.style.border = "2px solid #fff";
  controlSlope.style.borderRadius = "3px";
  controlSlope.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlSlope.style.cursor = "pointer";
  controlSlope.style.marginBottom = "22px";
  controlSlope.style.marginTop = "22px";
  controlSlope.style.textAlign = "center";
  controlSlope.innerHTML = "Toggle Slope";

  return controlSlope;
}
// ==================================================================

async function initMap() {
  // The location of Cyberport
  const position = { lat: 22.26220659110438, lng: 114.1306570511099 };

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map
  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Cyberport",
  });

  // Initialize a data layer to hold the paths
  customLayer = new google.maps.Data();
  customLayer.setMap(map);
  // Example WKT LINESTRING
  const res = await fetch("http://localhost:8080/bicycle_route");
  const response = await res.json();
  for (let i = 0; i < response.data.length; i++) {
    const wktLineString = response.data[i].path;

    // Parse the WKT string
    const coordinates = parseWKTLineString(wktLineString);

    // Create the LineString
    const pathCoordinates = coordinates.map(
      (coord) => new google.maps.LatLng(coord.lat, coord.lng)
    );
    const lineString = new google.maps.Data.LineString(pathCoordinates);

    // Add paths to the custom data layer

    customLayer.add({
      geometry: lineString,
      properties: {},
    });
    
  }

  // Initially hide the layer
  customLayer.setStyle({
    visible: false, // Initially hidden
  });

  const controlDiv = document.createElement("div");
  const controlUI = createControlUI(map);

  // Add the control to the map
  controlDiv.appendChild(controlUI);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUI.addEventListener("click", function () {
    const isVisible = customLayer.getStyle().visible;
    customLayer.setStyle({
      strokeColor: "#FF0000", // Retain custom stroke color
      strokeOpacity: 0.5, // Retain custom stroke opacity
      strokeWeight: 5, // Retain custom stroke weight
      visible: !isVisible, // Toggle visibility
    });
  });
  
   // Initialize a data layer to hold the paths ===============================
   SlopeLayer = new google.maps.Data();
   SlopeLayer.setMap(map);
   // Example WKT LINESTRING
   const SlopeRes = await fetch("http://localhost:8080/slope");
   const SlopeResponse = await SlopeRes.json();
   for (let i = 0; i < SlopeResponse.data.length; i++) {
     const wktLineString = SlopeResponse.data[i].path;
 
     // Parse the WKT string
     const coordinates = parseWKTLineString(wktLineString);
 
     // Create the LineString
     const pathCoordinates = coordinates.map(
       (coord) => new google.maps.LatLng(coord.lat, coord.lng)
     );
     const lineString = new google.maps.Data.LineString(pathCoordinates);
 
     // Add paths to the custom data layer
 
     SlopeLayer.add({
       geometry: lineString,
       properties: {},
     });
   }
 
   // Initially hide the layer
   SlopeLayer.setStyle({
     visible: false, // Initially hidden
   });
 
   const controlslopeDiv = document.createElement("div");
   const controlSlope = createControlUI(map);
 
   // Add the control to the map
   controlslopeDiv.appendChild(controlSlope);
   map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlslopeDiv);
 
   // Add click event to toggle the visibility of the custom layer
   controlSlope.addEventListener("click", function () {
     const isVisible = SlopeLayer.getStyle().visible;
     SlopeLayer.setStyle({
       strokeColor: "#FFFF00", // Retain custom stroke color
       strokeOpacity: 0.5, // Retain custom stroke opacity
       strokeWeight: 5, // Retain custom stroke weight
       visible: !isVisible, // Toggle visibility
     });
   });
 }
 
 initMap();
 

