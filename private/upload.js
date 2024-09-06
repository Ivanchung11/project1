window.onload = async () => {
  console.log("hello");

  uploadRouteListener();

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
};

//================================
//================================SEE BELOW

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

function uploadRouteListener() {
  let routeForm = document.querySelector("#route-form");
  routeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let form = event.currentTarget;

    let isPublic = document.querySelector(
      'input[name="isPublic"]:checked'
    ).value;
    let isRoad = document.querySelector('input[name="isRoad"]:checked');

    if ((routeNameInputBox.value == "")) {
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

//================================SEE ABOVE
//================================

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 22.32574171900254, lng: 114.16718211578858 },
    zoom: 11,
  });
}

initMap();
