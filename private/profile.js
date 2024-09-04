window.onload = async () => {
  const usernameLabel = document.querySelector("#username");
  await getProfile(usernameLabel);
  recentRecords()
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

async function recentRecords() {
  const res = await fetch("/recentRecords");
  const data1 = await res.json();
  // console.log(data1);
  if (res.ok) {
    if (data1.message === "You Don't Have Any Bookmark Route") {
      document.getElementById("bookmark-card").innerHTML = `
      <div id="nobookmark"><h2>You Don't Have Any Bookmark Route</h2></div>
      `;
    } else {
      createCard(data1,"upload-card")
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
      <div id="nobookmark"><h2>You Don't Have Any Bookmark Route</h2></div>
      `;
    } else {
      createCard(data1,"bookmark-card")
    }
  }
}

function createCard(data1,cardId) {
  let html = "";
      for (let i = 0; i < data1.row.length; i++) {
        let data = data1.row[i];
        let path = data.path;
      let arrayPath = [];
      let centrePath = data.centre;
      let newpath ;
      // console.log(centrePath);
      
      let centrePathsubstring = centrePath.substring(7, centrePath.length - 1);
      centrePathsubstring = centrePathsubstring.split(" ");
      centrePathsubstring = centrePathsubstring[1] + "," + centrePathsubstring[0]
      // console.log(centrePathsubstring);
      // console.log(path.length);
      let point = Math.ceil((path.length)/90)
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
        html +=  `
          <div class="col">
            <div class="card shadow-sm">
              <img class="bd-placeholder-img card-img-top" width="100%" height="100%" src="${photo}" >
              <div class="card-body">
                <p class="fs-4">${data.route_name}</p>
                <p class="card-text">${data.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <a class="btn btn-sm btn-outline-secondary" href="http://localhost:8080/comment.html?route_id=${data.id}" role="button">Details</a>
                  </div>
                  <small class="text-body-secondary">${data.view_count}</small>
                </div>
              </div>
            </div>
          </div>
      `;
      }
      document.getElementById(cardId).innerHTML = html
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