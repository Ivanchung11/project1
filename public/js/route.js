// Initialize and add the map
let map;
let TrackLayer;
let SlopeLayer;
let parkingLayer;
let waterLayer;
let customRouteLayer;
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


// Create a custom control button custom route =================================
function createControlUICustomRoute(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.marginTop = "22px";
  controlUI.style.textAlign = "center";
  controlUI.innerHTML = "Toggle customRoute Sites";

  return controlUI;
}
// ==================================================================

async function initMap() {
  // The location of Cyberport
  const position = { lat: 22.323836184109705, lng: 114.17130198913887 };

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { PinElement } = await google.maps.importLibrary("marker");

  // The map
  map = new Map(document.getElementById("map"), {
    zoom: 12,
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

  // =========Initialize the markers for PARKINGS=========

  const parkingRes = await fetch("http://localhost:8080/parking");
  const parkingResponse = await parkingRes.json();

  let parkings = [];

  for (let i = 0; i < parkingResponse.data.length; i++) {
    const wktPoint = parkingResponse.data[i].point;

    // Parse the WKT point into {latlng}
    const coord = parseWKTPoint(wktPoint);

    //set properties for the pins
    const pin = new PinElement({
      scale: 0.8,
      background: "#FBBC04",
    });

    //setup marker element
    let parking = new AdvancedMarkerElement({
      //use the {latlng} as position, (instead of point objects)
      position: coord,
      map: map,
      content: pin.element,
    });
    parking.map = null;
    parkings.push(parking);
  }

  // console.log(parkings);
  const controlParkingDiv = document.createElement("div");
  const controlUIParking = createControlUIParking(map);

  // Add the control to the map
  controlParkingDiv.appendChild(controlUIParking);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlParkingDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUIParking.addEventListener("click", function () {
    //   const isVisible = false;

    for (let parking of parkings) {
      if (parking.map == null) {
        parking.map = map;
      } else {
        parking.map = null;
      }
    }
  });

  // =========Initialize the markers for WATER DISPENSER=========

  const waterRes = await fetch("http://localhost:8080/water_dispenser");
  const waterResponse = await waterRes.json();

  // var infowindow = new google.maps.InfoWindow();

  // var marker ,i;
  let waters = [];

  for (let i = 0; i < waterResponse.data.length; i++) {
    const wktPoint = waterResponse.data[i].point;

    // Parse the WKT point into {latlng}
    const coord = parseWKTPoint(wktPoint);

    //set properties for the pins
    const pin = new PinElement({
      scale: 0.8,
      background: "#afe6eb",
      borderColor: "#1e81b0",
    });

    //setup marker element
    let water = new AdvancedMarkerElement({
      //use the {latlng} as position, (instead of point objects)
      position: coord,
      map: map,
      content: pin.element,
    });
    water.map = null;
    waters.push(water);
    // google.maps.event.addListener(water, 'click', (function(water, i) {
    //   return function() {
    //     infowindow.setContent(locations[i][0]);
    //     infowindow.open(map, water);
    //   }
    // })(water, i));
  }

  // console.log(parkings);
  const controlWaterDiv = document.createElement("div");
  const controlUIWater = createControlUIWater(map);

  // Add the control to the map
  controlWaterDiv.appendChild(controlUIWater);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlWaterDiv);

  // Add click event to toggle the visibility of the custom layer
  controlUIWater.addEventListener("click", function () {
    //   const isVisible = false;

    for (let water of waters) {
      if (water.map == null) {
        water.map = map;
      } else {
        water.map = null;
      }
    }
  });
  
  // ==========Initialize a data layer to hold the custom ruote==========
  customRouteLayer = new google.maps.Data();
  customRouteLayer.setMap(map);
  // Example WKT LINESTRING
  const customRouteRes = await fetch("http://localhost:8080/customroute");
  const customRouteResponse = await customRouteRes.json();
  for (let i = 0; i < customRouteResponse.data.length; i++) {
    const wktLineString = customRouteResponse.data[i].path;

    // Parse the WKT string
    const coordinates = parseWKTLineString(wktLineString);

    // Create the LineString
    const pathCoordinates = coordinates.map(
      (coord) => new google.maps.LatLng(coord.lat, coord.lng)
    );
    const lineString = new google.maps.Data.LineString(pathCoordinates);

    // Add paths to the custom data layer

    customRouteLayer.add({
      geometry: lineString,
      properties: {},
    });
  }

  // Initially hide the layer
  customRouteLayer.setStyle({
    visible: false, // Initially hidden
  });

  const controlCustomRouteDiv = document.createElement("div");
  const controlUICustomRoute = createControlUICustomRoute(map);

  // Add the control to the map
  controlCustomRouteDiv.appendChild(controlUICustomRoute);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    controlCustomRouteDiv
  );

  // Add click event to toggle the visibility of the custom layer
  controlUICustomRoute.addEventListener("click", function () {
    const isVisible = customRouteLayer.getStyle().visible;
    customRouteLayer.setStyle({
      strokeColor: "#FF0000", // Retain custom stroke color
      strokeOpacity: 0.5, // Retain custom stroke opacity
      strokeWeight: 5, // Retain custom stroke weight
      visible: !isVisible, // Toggle visibility
    });
  });
}


initMap();

