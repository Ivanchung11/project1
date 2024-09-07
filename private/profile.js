window.onload = async () => {
  const usernameLabel = document.querySelector("#username");
  await getProfile(usernameLabel);
  recentRecords();
  profileBookmark();
  profilePhoto();
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

async function recentRecords() {
  const res = await fetch("/recentRecords");
  const data1 = await res.json();
  console.log(data1);
  if (res.ok) {
    if (data1.message === "You Don't Have Any Bookmark Route") {
      document.getElementById("bookmark-card").innerHTML = `
      <div id="nobookmark"><h2>You Don't Have Any Bookmark Route</h2></div>
      `;
    } else {
      createCard(data1, "upload-card");
      await checkPublicPrivateStatus(data1);
    }
  }
}

async function profileBookmark() {
  const res = await fetch("/profileBookmark");
  const data1 = await res.json();

  // console.log(data);

  if (res.ok) {
    if (data1.message === "You Don't Have Any Bookmark Route") {
      document.getElementById("bookmark-card").innerHTML = `
      <div id="nobookmark"><h2>You Don't Have Any Bookmark Route.</h2></div>
      `;
    } else {
      const nopublicPrivateBtn = `<p></p>`;
      bookmarkCreateCard(data1, "bookmark-card");
    }
  }
}

async function profilePhoto() {
  const res = await fetch("/profilephoto");
  const data1 = await res.json();

  console.log(data1);

  if (res.ok) {
    if (data1.message === "You Don't Have Any Photo") {
      document.getElementById("photo-container").innerHTML = `
      <div id="nophoto"><h2>You Don't Have Any Photo</h2></div>
      `;
    } else {
      for (let photo of data1.row) {
        console.log(photo);
        document.getElementById("photo-container").innerHTML += `
        <a href="http://localhost:8080/comment.html?route_id=${photo.route_id}"><li
        style="
        background-image: url(./data/${photo.image_path});
        "
        ></li></a>
`;
      }
    }
  }
}

async function createCard(data1, cardId) {
  let html = "";
  for (let i = 0; i < data1.row.length; i++) {
    let data = data1.row[i];
    let path = data.path;
    let isPublic = data.public_private;
    let arrayPath = [];
    let centrePath = data.centre;
    let newpath;
    // console.log(centrePath);

    let centrePathsubstring = centrePath.substring(7, centrePath.length - 1);
    centrePathsubstring = centrePathsubstring.split(" ");
    centrePathsubstring = centrePathsubstring[1] + "," + centrePathsubstring[0];
    // console.log(centrePathsubstring);
    // console.log(path.length);
    let point = Math.ceil(path.length / 90);
    // console.log(point);

    for (let i = 0; i < path.length; i = i + point) {
      let eachpoint = path[i];
      let pathsubstring = eachpoint.substring(6, eachpoint.length - 1);
      pathsubstring = pathsubstring.split(" ");
      // console.log(pathsubstring)
      pathsubstring = pathsubstring[1] + "," + pathsubstring[0];
      arrayPath.push(pathsubstring);
      // console.log(data);

      newpath = arrayPath.join("|");
      // console.log(newpath);
    }
    let paths = "color:0x0000ff|weight:5|" + newpath;
    // console.log(path);
    let photo = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=${centrePathsubstring}&zoom=11.5&path=${paths}&key=AIzaSyCo1JCRkidb9kvtuz2gOAKgYwQvyMavfVM`;
    // console.log(photo);
    // console.log(data.public_private);

    if (isPublic) {
      html += `
          <div class="col">
            <div class="card shadow-sm">
              <img class="bd-placeholder-img card-img-top" width="100%" height="100%" src="${photo}">
              <div class="card-body">
                <p class="fs-4">${data.route_name}</p>
                <p class="card-text">${data.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                  <button class="publicPrivate btn btn-sm btn-outline-secondary" type="button" id="button${data.id}">public</button>
                    <a class="btn btn-sm btn-outline-secondary" href="http://localhost:8080/comment.html?route_id=${data.id}" role="button" >Details</a>
                  </div>
                  <small class="text-body-secondary">${data.view_count} View</small>
                </div>
              </div>
            </div>
          </div>
      `;
    } else {
      html += `
            <div class="col">
              <div class="card shadow-sm">
                <img class="bd-placeholder-img card-img-top" width="100%" height="100%" src="${photo}">
                <div class="card-body">
                  <p class="fs-4">${data.route_name}</p>
                  <p class="card-text">${data.description}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <button class="publicPrivate btn btn-sm btn-outline-secondary" type="button" id="button${data.id}">private</button>
                      <a class="btn btn-sm btn-outline-secondary" href="http://localhost:8080/comment.html?route_id=${data.id}" role="button" >Details</a>
                    </div>
                    <small class="text-body-secondary">${data.view_count} View</small>
                  </div>
                </div>
              </div>
            </div>
        `;
    }
  }
  document.getElementById(cardId).innerHTML = html;
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

function bookmarkCreateCard(data1, cardId) {
  let html = "";
  for (let i = 0; i < data1.row.length; i++) {
    let data = data1.row[i];
    let path = data.path;
    let isPublic = data.public_private;
    let arrayPath = [];
    let centrePath = data.centre;
    let newpath;
    // console.log(centrePath);

    let centrePathsubstring = centrePath.substring(7, centrePath.length - 1);
    centrePathsubstring = centrePathsubstring.split(" ");
    centrePathsubstring = centrePathsubstring[1] + "," + centrePathsubstring[0];
    // console.log(centrePathsubstring);
    // console.log(path.length);
    let point = Math.ceil(path.length / 90);
    // console.log(point);

    for (let i = 0; i < path.length; i = i + point) {
      let eachpoint = path[i];
      let pathsubstring = eachpoint.substring(6, eachpoint.length - 1);
      pathsubstring = pathsubstring.split(" ");
      // console.log(pathsubstring)
      pathsubstring = pathsubstring[1] + "," + pathsubstring[0];
      arrayPath.push(pathsubstring);
      // console.log(arrayPath);

      newpath = arrayPath.join("|");
      // console.log(newpath);
    }
    let paths = "color:0x0000ff|weight:5|" + newpath;
    // console.log(path);
    let photo = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=${centrePathsubstring}&zoom=11.5&path=${paths}&key=AIzaSyCo1JCRkidb9kvtuz2gOAKgYwQvyMavfVM`;
    // console.log(photo);
    // console.log(data.public_private);

    html += `
            <div class="col">
              <div class="card shadow-sm">
                <img class="bd-placeholder-img card-img-top" width="100%" height="100%" src="${photo}">
                <div class="card-body">
                  <p class="fs-4">${data.route_name}</p>
                  <p class="card-text">${data.description}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    
                      <a class="btn btn-sm btn-outline-secondary" href="http://localhost:8080/comment.html?route_id=${data.id}" role="button">Details</a>
                    </div>
                    <small class="text-body-secondary">${data.view_count} View</small>
                  </div>
                </div>
              </div>
            </div>
        `;
  }
  document.getElementById(cardId).innerHTML = html;
}

async function checkPublicPrivateStatus(data1) {
  for (let i = 0; i < data1.row.length; i++) {
    const btn = document.querySelector(`#button${data1.row[i].id}`);
    btn.addEventListener("click", async (e) => {
      // console.log(data1.row[i].id);
      // console.log(data1.row[i].public_private);
      if (data1.row[i].public_private) {
        changePublicPrivate(data1.row[i].id, "/changePublicPrivate");
        if (confirm("change to private") == true) {
          // window.location = "/profile.html";
          // createCard(data1, "upload-card")
          location.reload(true)
        } else {
          changePublicPrivate(data1.row[i].id, "/changePublicPrivate");
        }
      } else {
        changePublicPrivate(data1.row[i].id, "/changePublicPrivate");
        if (confirm("change to public") == true) {
          // window.location = "/profile.html";
          location.reload(true)
          // history.go(0)
        } else {
          changePublicPrivate(data1.row[i].id, "/changePublicPrivate");
        }
      }
    });
  }
}

async function changePublicPrivate(data_id, path) {
  const res = await fetch(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ routeId: data_id }),
  });

  // window.location("/profile.html")
}
