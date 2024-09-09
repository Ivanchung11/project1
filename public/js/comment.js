window.onload = async () => {
  // const usernameLabel = document.querySelector("#username");
  await initMap();

  await changeViewCount();

  await getProfile("#commentBarBtn");

  await getRouteDetails();

  await getAllComment();

  setupCommentButton();

  await checkBookmarkStatus();
  setupBookmarkButton();

  await printEleGraph();
};
// ========================================================================================

//==================== the layer with the googlemap =========================
let customRouteLayer;

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

// Create a custom control button parking =================================
function createControlUIParking(map) {
  const controlUI = document.createElement("button");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginBottom = "22px";
  controlUI.style.margin = "22px 5px";
  controlUI.style.textAlign = "center";
  controlUI.style.fontSize = "15px";
  controlUI.innerHTML = "Bicycle Parking Sites";

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
  controlUI.style.margin = "22px 5px";
  controlUI.style.textAlign = "center";
  controlUI.style.fontSize = "15px";
  controlUI.innerHTML = "Water Dispenser Sites";

  return controlUI;
}
// ==================================================================

async function initMap() {
  const path =
    "/showRouteDetails?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();
  let position;
  let centrePoint = data.centrePoint;
  let latDiff = data.latDiff;
  console.log(data);

  const coord = parseWKTPoint(centrePoint);
  // console.log(coord);
  position = coord;

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { PinElement } = await google.maps.importLibrary("marker");

    let map = new Map(document.getElementById("map"), {
      center: position,
      zoom: Math.floor(8 - Math.log(1.6446 * (latDiff/1000) / Math.sqrt(2 * (400 * 400))) / Math.log (2)),
      mapId: "DEMO_MAP_ID",
      mapTypeControl: false
    });

  customRouteLayer = new google.maps.Data();
  customRouteLayer.setMap(map);
  // Example WKT LINESTRING

  for (let i = 0; i < data.row.length; i++) {
    const wktLineString = data.row[i].path;
    // console.log(wktLineString);

    // Parse the WKT string
    const coordinates = parseWKTLineString(wktLineString);
    // console.log(coordinates,coordinates[0],coordinates[111],coordinates[(111*2)],coordinates[(111*3)],coordinates[(111*4)],coordinates[(111*5)]);

    // // Create the LineString
    const pathCoordinates = coordinates.map(
      (coord) => new google.maps.LatLng(coord.lat, coord.lng)
    );
    // console.log(pathCoordinates);

    const lineString = new google.maps.Data.LineString(pathCoordinates);
    // console.log(lineString);
    // // Add paths to the custom data layer

    customRouteLayer.add({
      geometry: lineString,
      properties: {},
    });
  }

  // Add click event to toggle the visibility of the custom layer
  customRouteLayer.setStyle({
    strokeColor: "#1d20f0", // Retain custom stroke color
    strokeOpacity: 0.7, // Retain custom stroke opacity
    strokeWeight: 5, // Retain custom stroke weight
  });

  const marker = new google.maps.Marker({ map, position: position });

  
//   const parser = new DOMParser();
// // A marker with a custom inline SVG.
// const pinSvgString =
// `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">
// <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
// </svg>`
// const pinSvg = parser.parseFromString(
// pinSvgString,
// "image/svg+xml",
// ).documentElement;
// const marker = new AdvancedMarkerElement({
// map,
// position: position,
// content: pinSvg,
// });
  function success(pos) {
    const crd = pos.coords;
    
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    

  // marker.setPosition();
  marker.setPosition({
    lat: crd.latitude,
    lng: crd.longitude
  });

    // Center map to user's position.
    // map.panTo({
    //   lat: crd.latitude,
    //   lng: crd.longitude,
    // });

    // navigator.geolocation.clearWatch(id);
  }

  function error(err) {
    console.log("change location");
  }

  // options = {
  //   enableHighAccuracy: false,
  //   timeout: 1000,
  //   maximumAge: 0,
  // };

id = navigator.geolocation.watchPosition(success, error);

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

  var infowindow = new google.maps.InfoWindow();

  var water ,i;
  let waters = [];

  for (let i = 0; i < waterResponse.data.length; i++) {


    const wktPoint = waterResponse.data[i].point;
    // console.log(waterResponse.data[i])

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
    google.maps.event.addListener(water, 'click', (function(water, i) {
      return function() {
        infowindow.setContent("<h6>"+waterResponse.data[i].facility+"</h6>" + "<br/>" + waterResponse.data[i].locationdetail);
        infowindow.open(map, water);
      }
    })(water, i));
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
}

// ========================================================================================

//==================== change the login and register button with the navbar =========================
async function getProfile(buttonId) {
  const res = await fetch("/profile");
  const data = await res.json();
  // console.log();

  if (data.message == "Please login first.") {
    // alert(data.message);
    console.log("please login first");
  } else {
    const rows = data.row;
    document.querySelector(
      buttonId
    ).innerHTML = `<div class="d-lg-flex col-lg-3 justify-content-lg-end" id="commentBarBtn">
            <div class="login-button">
            <button class="btn btn-outline-primary" >
              <div>Hi&nbsp<span>${rows.name}</span></div>
              </button>
            </div>
            <button class="btn btn-primary me-1" id="logout">Logout</button>
      </div>`;

    const logout = document.querySelector("#logout");
    Logout();
  }
}

async function Logout() {
  logout.addEventListener("click", async (e) => {
    console.log(e.target);

    const res = await fetch("/logout", {
      method: "get",
    });

    const data = await res.json();

    if (res.ok) {
      alert("logout success");
      window.location = "/route.html";
    } else {
      alert("error!!!");
    }
  });
}

// ========================================================================================

//====================  get detail with the route by route.id =========================

async function getRouteDetails() {
  const path =
    "/getRouteDetails?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();

  const user_name = data.row.users_name;
  const route_name = data.row.route_name;
  const description = data.row.description;
  const distance = MeterToKM(data.row.distance);
  let duration = "N/A";
  if (data.row.duration != 0) {
    duration = secondsToHms(data.row.duration);
  }
  const created_at = data.row.created_at.substring(0, 10);
  const start_district = data.row.start_district;
  const end_district = data.row.end_district;

  console.log(
    route_name,
    description,
    distance,
    duration,
    created_at,
    start_district
  );

  document.getElementById(
    "route_name"
  ).innerHTML = `<div id="route_name">${route_name}</div>`;
  document.getElementById(
    "descripationText"
  ).innerHTML = `<div id="descripationText">${description}</div>`;
  document.getElementById(
    "created_at"
  ).innerHTML = `<div id="created_at">Date:  ${created_at}</div>`;
  document.getElementById(
    "distance"
  ).innerHTML = `<div id="distance"><b>Distance</b><br>${distance}</div>`;
  document.getElementById(
    "duration"
  ).innerHTML = `<div id="duration"><b>Duration</b><br>${duration}</div>`;
  document.getElementById(
    "created_at"
  ).innerHTML = `<div id="created_at">Date:  ${created_at}</div>`;
  document.getElementById(
    "start_district"
  ).innerHTML = `<div id="start_district"><b>Start District</b><br>${start_district}</div>`;
  document.getElementById(
    "end_district"
  ).innerHTML = `<div id="end_district"><b>Finish District</b><br>${end_district}</div>`;
  document.getElementById(
    "created_by"
  ).innerHTML = `<div id="created_by">Created by:  ${user_name}</div>`;

  for (let photo of data.photorow) {
    console.log(photo.image_path);
    document.getElementById(
      "photo-container"
    ).innerHTML += `<img src="./data/${photo.image_path}" alt="Mountains">`;
  }
}

// ========================================================================================

//====================  comment =========================

async function getAllComment() {
  const path =
    "/getAllComment?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();
  console.log(data);

  if (res.ok) {
    html(data);
  } else {
    alert("error!");
  }
}

function setupCommentButton() {
  let commentbtn = document.querySelector("#commentBtn");
  commentbtn.addEventListener("click", async (event) => {
    showCommentSection();
  });
}

function showCommentSection() {
  document.getElementById("comment").innerHTML = `
    <div id="comment">
    <textarea  id="text" style="width: 70%"></textarea>
    <br>
    <button type="submit" id="uploadBtn" class="btn btn-md btn-outline-secondary">Submit</button>
    </div>
    <br>
    `;

  window.scrollTo(0, document.body.scrollHeight);

  let uploadbtn = document.querySelector("#uploadBtn");
  uploadbtn.addEventListener("click", async (event) => {
    uploadComment();
  });
}

function hideCommentSection() {
  document.getElementById("comment").innerHTML = `<div id="comment"> </div>`;
  getAllComment();
}

async function uploadComment() {
  const text = await document.getElementById("text").value;

  // Check the length of comment text
  if (text.length === 0) {
    alert("Comment cannot be empty.");
    return;
  }

  console.log(text);
  const body = {
    routeId: getRouteId(),
    content: text,
  };
  console.log(body);

  const res = await fetch("/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (res.ok) {
    alert("comment success");
    hideCommentSection();
  } else {
    // Display error alert and redirect to login page.
    alert(data.message);
    window.location.pathname = "/login.html";
  }
}

// async function checkFollowStatus() {
//   const res = await fetch("/folllow");
//   const data = await res.json();

//   console.log("follow",data.isFollowed);
//   isFollowed = data.isFollowed;
// }

// function follow() {
//   let followbtn = document.querySelector("#followBtn");
//   followbtn.addEventListener("click", async (e) => {

//     const res = await fetch("/follow", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({routeId: (getRouteId())}),
//     });
//     const data = await res.json();

//     if (res.ok) {
//       isFollowed = true;
//       alert(data.message);
//     } else{
//       alert(data.message);
//     }
//   });
// }

// ========================================================================================

//====================  bookmark and unbookmark=========================

let isBookmarked = false;
let isFollowed = false;

async function checkBookmarkStatus() {
  const path =
    "/bookmark?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();

  console.log("bookmark", data.isBookmarked);
  isBookmarked = data.isBookmarked;
}

function setupBookmarkButton() {
  updateBookmarkButton();

  let bookmarkbtn = document.querySelector("#bookmarkBtn");
  bookmarkbtn.addEventListener("click", async (e) => {
    if (isBookmarked) {
      await unbookmark();
      updateBookmarkButton();
    } else {
      await bookmark();
      updateBookmarkButton();
    }
  });
}

function updateBookmarkButton() {
  document.getElementById("bookmarkBtn").innerHTML = isBookmarked
    ? "Unbookmark"
    : "Bookmark";
}

async function bookmark() {
  const res = await fetch("/bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ routeId: getRouteId() }),
  });
  const data = await res.json();

  if (res.ok) {
    isBookmarked = true;
    alert(data.message);
  } else {
    alert(data.message);
    window.location.pathname = "/login.html";
  }
}

async function unbookmark() {
  const res = await fetch("/bookmark", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ routeId: getRouteId() }),
  });
  const data = await res.json();
  isBookmarked = false;
  alert(data.message);
}

// ========================================================================================

//====================  view count =========================

async function changeViewCount() {
  const path =
    "/viewCount?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();

  console.log(data);
}

// =======================================================

// ================ elevation graph ==========
// import Chart from 'chart.js/auto';

async function printEleGraph() {
  const path =
    "/showEle?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();

  let elePairs = data.elePairs;
  console.log(elePairs)
  
  if (elePairs[0].y !=0 || elePairs[1].y !=0){

    const dataGraph = {
      datasets: [
        {
          label: "路徑高度圖",
          data: elePairs,
          showLine: true,
          // tension: 0.4,
        },
      ],
    };
    
    const config = {
      type: "scatter",
      data: dataGraph,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          point: { pointStyle: false },
          line: {
            tension: 0.2,
            borderColor: "rgba(0, 153, 0,0.6)",
          },
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              text: "Distance(km)",
              display: true,
            },
          },
          y: {
            type: "linear",
            grace: "10%",
            title: { text: "Elevation(m)", display: true },
          },
        },
      },
    };
    
    // document.querySelector(".chart").innerHTML = 
    // `<div class="chart-title">Chart</div>
    // <div id="canvas-container">
    //   <canvas id="myChart"></canvas>
    //   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    // </div>`

    var myChart = new Chart(document.getElementById("myChart"), config);
  }
}

// ========================================================================================

//====================  other function =========================

function html(data) {
  let html = " ";
  for (let i = 0; i < data.row.length; i++) {
    const comment = data.row[i];
    const poster = comment.name;
    const text = comment.content;
    // console.log(comment);
    // console.log(poster);
    // console.log(text);
    html += `
              <div id="comment-text">${poster} : ${text}</div>
              `;
  }
  document.getElementById(`comment-text`).innerHTML = html;
}

function secondsToHms(d) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60)
    .toString()
    .padStart(2, "0");
  let s = Math.floor((d % 3600) % 60)
    .toString()
    .padStart(2, "0");
  return `${h} : ${m} : ${s}`;
}

function MeterToKM(d) {
  d = Number(d);
  let km = Math.floor(d / 1000);
  let m = Math.floor((d % 1000) / 100);
  return `${km}.${m} KM`;
}

function getRouteId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("route_id");
}
