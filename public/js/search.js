window.onload = async () => {
    console.log("hello");
    getProfile("#searchBarBtn")
    searchButtonListener();
  
    let toggles = document.querySelectorAll(".toggle");
    for (let toggle of toggles) {
      toggle.addEventListener("click", () => {
        console.log(toggle.value);
      });
    }
  };
  
  //================================
  //================================SEE BELOW
  
  function searchButtonListener() {
    let searchForm = document.querySelector("#search-form");
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      let form = event.currentTarget;
  
      // let startDistricts = document.querySelectorAll('input[name="startDistrict"]:checked')
  
      function getCheckedBoxes(chkboxName) {
        var checkboxes = document.getElementsByName(chkboxName);
        var checkboxesChecked = [];
        // loop over them all
        for (var i = 0; i < checkboxes.length; i++) {
          // And stick the checked ones onto an array...
          if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i].value);
          }
        }
        // Return the array if it is non-empty, or null
        return checkboxesChecked.length > 0 ? checkboxesChecked : null;
      }
  
      // Call as
      let startDistricts = getCheckedBoxes("startDistrict");
      let endDistricts = getCheckedBoxes("endDistrict");
      let isRoads = getCheckedBoxes("isRoad");
  
      let formObject = {
        startDistricts,
        endDistricts,
        isRoads,
      };
  
      console.log(formObject);
  
      let res = await fetch("/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });
  
      let response = await res.json();
      console.log(response.row.length)
  
      if (res.status == 200) {
        createCard(response, "route-card");
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        let response = await res.json();
        alert(response.message);
      }
    });
  }
  
  //================================SEE ABOVE
  //================================
  
  function createCard(data1, cardId) {
    let html = "";
    console.log(data1)
    for (let i = 0; i < data1.row.length; i++) {
      let data = data1.row[i];
      let path = data.path;
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
  
        newpath = arrayPath.join("|");
        // console.log(newpath);
      }
      let paths = "color:0x0000ff|weight:5|" + newpath;
      // console.log(path);
      let photo = `https://maps.googleapis.com/maps/api/staticmap?size=400x400&center=${centrePathsubstring}&zoom=11.5&path=${paths}&key=AIzaSyCo1JCRkidb9kvtuz2gOAKgYwQvyMavfVM`;
      // console.log(photo);
      html += `
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
    document.getElementById(cardId).innerHTML = html;
  }
  
  //================================SEE ABOVE
  //================================


  // ==========change login ang register button on the navbar==========
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