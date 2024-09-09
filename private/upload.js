window.onload = async () => {
  console.log("hello");

  let toggles = document.querySelectorAll(".toggle");
  for (let toggle of toggles) {
    toggle.addEventListener("click", () => {
      console.log(toggle.value);
    });
  }

  const usernameLabel = document.querySelector("#username");

  const logoutBtn = document.querySelector("#logout");

  await getProfile();
  async function getProfile() {
    const res = await fetch("/profile");
    const data = await res.json();
    // console.log(data.row.username);

    if (res.ok) {
      // console.log(data.row.username);

      const rows = data.row;
      usernameLabel.innerHTML = rows.name;
    } else {
      alert("error !!!");
    }
  }

  const logout = document.getElementById("logout");

  logout.addEventListener("click", async (e) => {
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

  initMap();
  inputGpxListener();
  uploadRouteListener();
};

//=======Initialize all entry box======

let routeNameInputBox = document.getElementById("routeName");
let startDistrictSelectBox = document.getElementById("startDistrict");
let endDistrictSelectBox = document.getElementById("endDistrict");
let cyclingTracksRadio = document.getElementById("cyclingTracks");
let carRoadRadio = document.getElementById("carRoad");
let durationInputBox = document.getElementById("durationInput");
let descriptionInputBox = document.getElementById("description");
let gpxfileInput = document.getElementById("gpx");
let photofileInput = document.getElementById("photo");
let publicRadio = document.getElementById("public");
let privateRadio = document.getElementById("private");

//=======uploadRouteListener will upload the route info and photo into database======
function uploadRouteListener() {
  let routeForm = document.querySelector("#route-form");
  routeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let form = event.currentTarget;

    let isPublic = document.querySelector(
      'input[name="isPublic"]:checked'
    ).value;
    let isRoad = document.querySelector('input[name="isRoad"]:checked');

    if (routeNameInputBox.value == "") {
      alert("Please enter a route name.");
    } else if (startDistrictSelectBox.value == "dummy") {
      alert("Please choose the district of starting point.");
    } else if (endDistrictSelectBox.value == "dummy") {
      alert("Please choose the district of finishing point.");
    } else if (isRoad == null) {
      alert("Please choose the type of route. (Route mainly consist of)");
    } else if (gpxfileInput.value == "") {
      alert("Please upload the gpx file of your route.");
    } else {
      let formData = new FormData();

      let durationString = form.durationInput.value;
      let durHour = parseInt(durationString.substring(0, 2));
      let durMin = parseInt(durationString.substring(3, 5));
      let durSec = parseInt(durationString.substring(6));
      let durationTemp = 3600 * durHour + 60 * durMin + durSec;

      formData.append("routeName", form.routeName.value); //有
      formData.append("description", form.description.value); //有
      formData.append("startDistrict", form.startDistrict.value); //有
      formData.append("endDistrict", form.endDistrict.value); //有
      formData.append("isRoad", isRoad.value); //有
      formData.append("isPublic", isPublic); //有
      formData.append("durationTemp", durationTemp); //有
      formData.append("gpx", form.gpx.files[0]); //有

      for (let key in form.photo.files) {
        if (parseInt(key) + 1) {
          file = document.getElementById("photo").files[key];
          formData.append(`photo${key}`, file);
        }
      }

      let res = await fetch("/uploadroute", {
        method: "post",
        body: formData,
      });
      if (res.status == 200) {
        let response = await res.json();
        if (response.message == "uploaded") {
          routeNameInputBox.value = "";
          startDistrictSelectBox.value = "dummy";
          endDistrictSelectBox.value = "dummy";
          durationInputBox.value = "00:00:00";
          descriptionInputBox.value = "";
          gpxfileInput.value = "";
          photofileInput.value = "";
          alert("Your route is successfully uploaded.");
        } else {
          alert(response.message);
        }
      } else {
        let response = await res.json();
        alert(response.message);
      }
    }
  });
}

//=======initMap will print the blank map======

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 22.331458167527128, lng: 114.18125834716588 },
    zoom: 11,
  });
}

//======inputGpxListener will show the name, duration
//======and route when select the gpx file======

var gpx = new gpxParser(); //Create gpxParser Object

let tempRouteName = "";
let tempDescription = "";

function secondsToHms(d) {
  d = Number(d);
  let h = Math.floor(d / 3600)
    .toString()
    .padStart(2, "0");
  let m = Math.floor((d % 3600) / 60)
    .toString()
    .padStart(2, "0");
  let s = Math.floor((d % 3600) % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}


function inputGpxListener() {
  gpxfileInput.addEventListener("change", async (event) => {
    event.preventDefault();
    console.log("123455");
    let fr = new FileReader();
    fr.onload = function () {
      console.log(fr.result);
      gpx.parse(fr.result);
      console.log(gpx);
      if (gpx.metadata.name) {
        routeNameInputBox.value = htmlDecode(gpx.metadata.name);
        descriptionInputBox.value = htmlDecode(gpx.metadata.name);
      }

      let geopoints = gpx.tracks[gpx.tracks.length - 1].points;
      let duration = 0;

      if (geopoints[0].time) {
        let longseg = [];
        for (let i = 0; i < geopoints.length - 1; i++) {
          let timeseg = (geopoints[i + 1].time - geopoints[i].time) / 1000;
          if (timeseg < 90) {
            duration += timeseg;
          } else {
            longseg.push(i);
          }
        }
      }
      durationInputBox.value = secondsToHms(duration);
      console.log(durationInputBox.value);

      let pathCoordinates = [];
      let maxlon = geopoints[0].lon;
      let minlon = geopoints[0].lon;
      let maxlat = geopoints[0].lat;
      let minlat = geopoints[0].lat;

      for (let i = 0; i < geopoints.length; i++) {
        let location = { lat: geopoints[i].lat, lng: geopoints[i].lon };
        pathCoordinates.push(location);

        if (geopoints[i].lon > maxlon) {
          maxlon = geopoints[i].lon;
        }
        if (geopoints[i].lon < minlon) {
          minlon = geopoints[i].lon;
        }
        if (geopoints[i].lat > maxlat) {
          maxlat = geopoints[i].lat;
        }
        if (geopoints[i].lat < minlat) {
          minlat = geopoints[i].lat;
        }
      }

      let midlon = (minlon + maxlon) / 2;
      let midlat = (minlat + maxlat) / 2;
      console.log(midlon, midlat);

      let trackCentre = { lat: midlat, lng: midlon };
      let latDiff = measure(minlat, minlon, maxlat, maxlon);
      console.log(trackCentre, pathCoordinates[10]);

      let tempRouteLayer;

      // Reprint the map
      async function reinitMap() {
        const { Map } = await google.maps.importLibrary("maps");

        map = new Map(document.getElementById("map"), {
          zoom: Math.floor(8 - Math.log(1.6446 * (latDiff/1000) / Math.sqrt(2 * (300 * 300))) / Math.log (2)),
          center: trackCentre,
          mapId: "DEMO_MAP_ID",
        });

        // ===================Initialize a data layer to hold the paths ===============================
        tempRouteLayer = new google.maps.Data();
        tempRouteLayer.setMap(map);
        const lineString = new google.maps.Data.LineString(pathCoordinates);

        // Add paths to the custom data layer
        tempRouteLayer.add({
          geometry: lineString,
          properties: {},
        });
        tempRouteLayer.setStyle({
          strokeColor: "#1d20f0", // Retain custom stroke color
          strokeOpacity: 0.7, // Retain custom stroke opacity
          strokeWeight: 5, // Retain custom stroke weight
        });
      }
      reinitMap();
    };
    fr.readAsText(gpxfileInput.files[0]);
  });
}
