// Initialize and add the map
let map;
let TrackLayer;
let SlopeLayer;
let parkingLayer;
let waterLayer;
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

function parseWKTPoint(wkt) {
  const matches = wkt.match(/POINT\s*\(([^)]+)\)/);
  if (!matches) return [];
  const coord = matches[1];
  const [lng, lat] = coord.trim().split(" ").map(Number);
  return { lat, lng };
}

// Create a custom control button
function createControlUITrack(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.margin = "22px 5px";
  controlUI.style.textAlign = "center";
  controlUI.innerHTML = "Toggle Cycling Track";

  return controlUI;
}

// Create a custom control button slope =================================
function createControlUISlope(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.margin = "22px 5px";
  controlUI.style.textAlign = "center";
  controlUI.innerHTML = "Toggle Slope";

  return controlUI;
}
// ==================================================================

// Create a custom control button parking =================================
function createControlUIParking(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.marginTop = "22px";
  controlUI.style.textAlign = "center";
  controlUI.innerHTML = "Toggle Parking Sites";

  return controlUI;
}
// ==================================================================

// Create a custom control button water dispenser =================================
function createControlUIWater(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.marginTop = "22px";
  controlUI.style.textAlign = "center";
  controlUI.innerHTML = "Toggle Water Dispenser Sites";

  return controlUI;
}
// ==================================================================

async function initMap() {
  // The location of Cyberport
  const position = { lat: 22.323836184109705, lng: 114.17130198913887 };

  const { Map } = await google.maps.importLibrary("maps");
  // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map
  map = new Map(document.getElementById("map"), {
    zoom: 24,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // ==========Initialize a data layer to hold the paths==========
  TrackLayer = new google.maps.Data();
  TrackLayer.setMap(map);
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

    TrackLayer.add({
      geometry: lineString,
      properties: {},
    });
  }

  // Initially hide the layer
  TrackLayer.setStyle({
    visible: false, // Initially hidden
  });

  const controlTrackDiv = document.createElement("div");
  const controlUITrack = createControlUITrack(map);

  // Add the control to the map
  controlTrackDiv.appendChild(controlUITrack);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlTrackDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUITrack.addEventListener("click", function () {
    const isVisible = TrackLayer.getStyle().visible;
    TrackLayer.setStyle({
      strokeColor: "#FF0000", // Retain custom stroke color
      strokeOpacity: 0.5, // Retain custom stroke opacity
      strokeWeight: 5, // Retain custom stroke weight
      visible: !isVisible, // Toggle visibility
    });
  });

  // ===================Initialize a data layer to hold the paths ===============================
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

  const controlSlopDiv = document.createElement("divslope");
  const controlUISlope = createControlUISlope(map);

  // Add the control to the map
  controlSlopDiv.appendChild(controlUISlope);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlSlopDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUISlope.addEventListener("click", function () {
    const isVisible = SlopeLayer.getStyle().visible;
    SlopeLayer.setStyle({
      strokeColor: "#FFFF00", // Retain custom stroke color
      strokeOpacity: 0.5, // Retain custom stroke opacity
      strokeWeight: 5, // Retain custom stroke weight
      visible: !isVisible, // Toggle visibility
    });
  });

  // =========Initialize a data layer to hold the points=========
  parkingLayer = new google.maps.Data();
  parkingLayer.setMap(map);
  // Example WKT POINT
  const res2 = await fetch("http://localhost:8080/parking");
  const response2 = await res2.json();
  for (let i = 0; i < response2.data.length; i++) {
    const wktPoint = response2.data[i].point;

    // Parse the WKT point
    const coord = parseWKTPoint(wktPoint);

    // Create the Point
    const point = new google.maps.Data.Point(coord);

    // Add point to the custom data layer
    parkingLayer.add({
      geometry: point,
      properties: {},
    });
  }

  // Initially hide the layer
  parkingLayer.setStyle({
    visible: false, // Initially hidden
  });

  const controlParkingDiv = document.createElement("div");
  const controlUIParking = createControlUIParking(map);

  // Add the control to the map
  // controlDiv.appendChild(controlUI);
  controlParkingDiv.appendChild(controlUIParking);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlParkingDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUIParking.addEventListener("click", function () {
    const isVisible = parkingLayer.getStyle().visible;
    parkingLayer.setStyle({
      strokeColor: "#F0F000", // Retain custom stroke color
      strokeOpacity: 0.5, // Retain custom stroke opacity
      strokeWeight: 5, // Retain custom stroke weight
      visible: !isVisible, // Toggle visibility
    });
  });

  // =========Initialize a data layer to hold the points: Water dispenser=========
  waterLayer = new google.maps.Data();
  waterLayer.setMap(map);
  // Example WKT POINT
  const waterRes = await fetch("http://localhost:8080/water_dispenser");
  const waterResponse = await waterRes.json();
  for (let i = 0; i < waterResponse.data.length; i++) {
    const wktPoint = waterResponse.data[i].point;

    // Parse the WKT point
    const coord = parseWKTPoint(wktPoint);

    // Create the Point
    const point = new google.maps.Data.Point(coord);

    // Add point to the custom data layer
    waterLayer.add({
      geometry: point,
      properties: {},
    });
  }

  // Initially hide the layer
  waterLayer.setStyle({
    visible: false, // Initially hidden
  });

  const controlWaterDiv = document.createElement("div");
  const controlUIWater = createControlUIWater(map);

  // Add the control to the map
  // controlDiv.appendChild(controlUI);
  controlWaterDiv.appendChild(controlUIWater);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlWaterDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUIWater.addEventListener("click", function () {
    const isVisible = waterLayer.getStyle().visible;
    waterLayer.setStyle({
      strokeColor: "#F0F000", // Retain custom stroke color
      strokeOpacity: 0.5, // Retain custom stroke opacity
      strokeWeight: 5, // Retain custom stroke weight
      visible: !isVisible, // Toggle visibility
    });
  });
}

function initialize() {
  var map = new google.maps.Map(
    document.getElementById("map-canvas"),
    mapOptions
  );

  // Resize stuff...
  google.maps.event.addDomListener(window, "resize", function () {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });
}

initMap();
// initialize();
