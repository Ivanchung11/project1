window.onload = async () => {
  console.log("hello");

  uploadRouteListener()

  let toggles = document.querySelectorAll(".toggle")
  for (let toggle of toggles){
    toggle.addEventListener("click", ()=>{
      console.log(toggle.value)
    })
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

function uploadRouteListener() {
  let routeForm = document.querySelector("#route-form");
  routeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let form = event.currentTarget;

    let formData = new FormData();

    let durationString = form.durationInput.value;
    let durHour = parseInt(durationString.substring(0, 2));
    let durMin = parseInt(durationString.substring(3, 5));
    let durSec = parseInt(durationString.substring(6));
    let durationTemp = 3600 * durHour + 60 * durMin + durSec;

    console.log("start to submit")
    console.log(form)
    let isPublic = document.querySelector('input[name="isPublic"]:checked').value
    let isRoad = document.querySelector('input[name="isRoad"]:checked').value
    console.log(isPublic, isRoad)

    formData.append("routeName", form.routeName.value);    //有
    formData.append("description", form.description.value);    //有
    formData.append("startDistrict", form.startDistrict.value);    //有
    formData.append("endDistrict", form.endDistrict.value);   //有
    formData.append("isRoad", isRoad);    //有
    formData.append("isPublic", isPublic);    //有
    formData.append("durationTemp", durationTemp);    //有
    formData.append("gpx", form.gpx.files[0]);   //有

    // for (let key in formData){
    //   console.log(key, ": ", formData[key])
    // }

    let res = await fetch("/uploadroute", {
      method: "post",
      body: formData,
    });

    if (res.status == 200) {
      let response = await res.json();
      alert(response.message);
    } else {
      let response = await res.json();
      alert(response.message);
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
