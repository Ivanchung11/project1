window.onload = async () => {
  console.log("hello");

  const usernameLabel = document.querySelector("#username");

  // const logoutBtn = document.querySelector("#logout");

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

  console.log(logout)

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

    formData.append("routeName", form.routeName.value);    //有
    formData.append("description", form.description.value);    //有
    formData.append("startDistrict", form.startDistrict.value);    //有
    formData.append("endDistrict", form.endDistrict.value);   //有
    formData.append("isRoad", form.isRoad.value);    //有
    formData.append("isPublic", form.isPublic.value);    //有
    formData.append("durationTemp", durationTemp);    //有
    // formData.append("gpx", form.file.files[0]);   //有

    console.log(formData)

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
