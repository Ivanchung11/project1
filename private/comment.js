async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  let map = new Map(document.getElementById("map"), {
    center: { lat: 22.32574171900254, lng: 114.16718211578858 },
    zoom: 11,
  });
}

initMap();

window.onload = async () => {
  const usernameLabel = document.querySelector("#username");
  
  await getProfile(usernameLabel);

  await getRouteDetails() 

  await getAllComment();

  setupCommentButton();

  await checkBookmarkStatus();
  setupBookmarkButton();
  
}
const logout = document.querySelector("#logout");
 Logout()

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

function Logout() {
  logout.addEventListener("click", async (e) => {
    
    const res = await fetch("/logout", {
      method: "get",
    });

    const data = await res.json();

    if (res.ok) {
      alert("logout success")
      window.location = "/route.html"
    } else {
      alert("error!!!")
    }
});
}





// window.onload = async () => {
//   await getAllComment();

//   setupCommentButton();

//   await checkBookmarkStatus();
//   setupBookmarkButton();

//   // await checkFollowStatus()
//   // follow()
// };

let isBookmarked = false;
let isFollowed = false;

function getRouteId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("route_id");
}

async function getRouteDetails() {

  const path = "/getRouteDetails?" + new URLSearchParams({
    "routeId": getRouteId(),
  }).toString();
  const res = await fetch(path);
    const data = await res.json();

    const user_name = data.row.users_name;
    const route_name = data.row.route_name;
    const description = data.row.description;
    const distance = MeterToKM(data.row.distance);
    const duration = secondsToHms(data.row.duration);
    const created_at = data.row.created_at.substring(0,10);
    const start_district = data.row.start_district;
    const end_district = data.row.end_district;
    
    console.log(route_name,description,distance,duration,created_at,start_district);
    
    document.getElementById("route_name").innerHTML = 
    `<div id="route_name">Title : ${route_name}</div>`
    document.getElementById("descripationText").innerHTML = 
    `<div id="descripationText">${description}</div>`
    document.getElementById("created_at").innerHTML = 
    `<div id="created_at">Date : ${created_at}</div>`
    document.getElementById("distance").innerHTML = 
    `<div id="distance">Distance<br>${distance}</div>`
    document.getElementById("duration").innerHTML = 
    `<div id="duration">Duration<br>${duration}</div>`
    document.getElementById("created_at").innerHTML = 
    `<div id="created_at">Date : ${created_at}</div>`
    document.getElementById("start_district").innerHTML = 
    `<div id="start_district">Start district<br>${start_district}</div>`
    document.getElementById("end_district").innerHTML = 
    `<div id="end_district">Finish district<br>${end_district}</div>`
    document.getElementById("created_by").innerHTML = 
    `<div id="created_by">Created by : ${user_name}</div>`
    

    
    
}

async function getAllComment() {
  const path = "/getAllComment?" + new URLSearchParams({
    "routeId": getRouteId(),
  }).toString();
  const res = await fetch(path);
    const data = await res.json();
    console.log(data);

  if (res.ok) {
    html(data)
  }else {
    alert("error!")
  }
  
}   

function setupCommentButton() {
  let commentbtn = document.querySelector("#commentBtn");
  commentbtn.addEventListener("click", async (event) => {
    showCommentSection();
  });
}

function showCommentSection() {
  document.getElementById("comment").innerHTML = 
    `
    <div id="comment">
    <textarea  id="text" style="width: 70%"></textarea>
    <br>
    <button type="submit" id="uploadBtn" class="btn btn-md btn-outline-secondary">Submit</button>
    </div>
    <br>
    `;

    let uploadbtn = document.querySelector("#uploadBtn");
    uploadbtn.addEventListener("click", async (event) => {
      uploadComment();
    });
}

function hideCommentSection() {
  document.getElementById(
    "comment"
  ).innerHTML = `<div id="comment"> </div>`;
  getAllComment()
}

async function uploadComment() {
  const text = await document.getElementById("text").value;

  // Check the length of comment text
  if (text.length === 0) {
    alert("Comment cannot be empty.")
    return
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
    window.location.pathname = "/login.html"
  }
}

// async function checkFollowStatus() {
//   const res = await fetch("/folllow");
//   const data = await res.json();

//   console.log("follow",data.isFollowed);
//   isFollowed = data.isFollowed;
// }


async function checkBookmarkStatus() {
  const path = "/bookmark?" + new URLSearchParams({
    "routeId": getRouteId(),
  }).toString();
  const res = await fetch(path);
  const data = await res.json();

  console.log("bookmark",data.isBookmarked);
  isBookmarked = data.isBookmarked;
}

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

function setupBookmarkButton() {
  updateBookmarkButton()

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
  document.getElementById(
    'bookmarkBtn'
  ).innerHTML = isBookmarked ? "Unbookmark" : "Bookmark";
}

async function bookmark() {
  const res = await fetch("/bookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({routeId: (getRouteId())}),
  });
  const data = await res.json();

  if (res.ok) {
    isBookmarked = true;
    alert(data.message);
  } else{
    alert(data.message);
    window.location.pathname = "/login.html"
  }
  
}

async function unbookmark() {
  const res = await fetch("/bookmark", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({routeId: (getRouteId())}),
  });
  const data = await res.json();
  isBookmarked = false;
  alert(data.message);
}


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
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);
  return `${h} : ${m} : ${s}`; 
}

function MeterToKM(d) {
  d = Number(d);
  let km= Math.floor(d / 1000);
  let m= Math.floor(d % 1000 /100)
  return `${km}.${m} KM`; 
}