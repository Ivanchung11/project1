window.onload = async () => {
  // const usernameLabel = document.querySelector("#username");
  await initMap();

  await changeViewCount()

  await getProfile("#commentBarBtn");

  await getRouteDetails();

  await getAllComment();

  setupCommentButton();

  await checkBookmarkStatus();
  setupBookmarkButton();
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

async function initMap() {
  
  const path =
    "/showRouteDetails?" +
    new URLSearchParams({
      routeId: getRouteId(),
    }).toString();
  const res = await fetch(path);
  const data = await res.json();
  let position ;
  let centrePoint = data.centrePoint;
  console.log(data)

  const coord = parseWKTPoint(centrePoint)
  // console.log(coord);
  position = coord
  
  const { Map } = await google.maps.importLibrary("maps");
  // const { PinElement } = await google.maps.importLibrary("marker");
  // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    let map = new Map(document.getElementById("map"), {
      center: position,
      zoom: 11.8,
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

function success(pos) {
  const crd = pos.coords;

  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);


  // const icon = document.createElement("div");

  // icon.innerHTML = '<i class="fa fa-pizza-slice fa-lg"></i>';
  
  // const faPin = new PinElement({
  //   glyph: icon,
  //   glyphColor: "#ff8300",
  //   background: "#FFD514",
  //   borderColor: "#ff8300",
  // });
  // const faMarker = new AdvancedMarkerElement({
  //   map,
  //   position: {
  //       lat: crd.latitude,
  //       lng: crd.longitude,
  //     },
  //   content: faPin.element,
  //   title: "A marker using a FontAwesome icon for the glyph.",
  // });


  
  // marker.setPosition();
  marker.setPosition({
    lat: crd.latitude,
    lng: crd.longitude,
  });
  // faMarker.setPosition({
  //   lat: crd.latitude,
  //   lng: crd.longitude,
  // });

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
  let duration = "N/A"
  if (data.row.duration != 0 ){
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

  for (let photo of (data.photorow)){
    console.log(photo.image_path)
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