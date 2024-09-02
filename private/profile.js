window.onload = async () => {
  const usernameLabel = document.querySelector("#username");

  await getProfile(usernameLabel);
  profileBookmark();
};
const logout = document.querySelector("#logout");
Logout();

async function getProfile(usernameLabel) {
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

async function profileBookmark() {
  const res = await fetch("/profileBookmark");
  const data = await res.json();
  // console.log(data);

  if (res.ok) {
    if (data.message === "You Don't Have Any Bookmark Route") {
      document.getElementById("col1").innerHTML = `
      <h1>You Don't Have Any Bookmark Route</h1>
      `;
    } else {
      // console.log(data.row.route_name);
      // console.log(data.row.description);
      // console.log(data.row.view_count);
      // console.log(data.row.id);

      let path = data.row.path;
      let arrayPath = [];
      console.log(path[1024 / 2]);

      for (let i = 0; i < path.length; i = i + 15) {
        let eachpoint = path[i];
        let pathsubstring = eachpoint.substring(6, eachpoint.length - 1);
        pathsubstring = pathsubstring.split(" ");
        // console.log(pathsubstring)
        pathsubstring = pathsubstring[1] + "," + pathsubstring[0];
        // console.log(pathsubstring)
        // pathsubstring = pathsubstring.replace(" ",",")
        arrayPath.push(pathsubstring);

        newpath = arrayPath.join("|");
        // console.log(newpath);
      }
      path = "color:0x0000ff|weight:5|" + newpath;
      // console.log(path);
      photo = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=22.367607,114.00037&zoom=12&path=${path}&key=AIzaSyCo1JCRkidb9kvtuz2gOAKgYwQvyMavfVM`;
      // console.log(photo);

      document.getElementById("col1").innerHTML = `
     <div id="col1">
            <div class="card shadow-sm">
              <img class="bd-placeholder-img card-img-top" width="100%" height="100%" src="${photo}" >
              <div class="card-body">
                <p class="fs-4">${data.row.route_name}</p>
                <p class="card-text">${data.row.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  </div>
                  <small class="text-body-secondary">${data.row.view_count}</small>
                </div>
              </div>
            </div>
          </div>
      `;
      console.log("yes");
    }
  }
}

function Logout() {
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
}
