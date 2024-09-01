window.onload = async () => {
  await getAllComment();

  setupCommentButton();

  await checkBookmarkStatus();
  setupBookmarkButton();
};

let isBookmarked = false;

function getRouteId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("route_id");
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
    <textarea  id="text" ></textarea>
    <br>
    <button type="submit" id="uploadBtn" class="btn btn-sm btn-outline-secondary">upload</button>
    </div>
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

async function checkBookmarkStatus() {
  const path = "/bookmark?" + new URLSearchParams({
    "routeId": getRouteId(),
  }).toString();
  const res = await fetch(path);
  const data = await res.json();

  console.log(data.isBookmarked);
  isBookmarked = data.isBookmarked;
}

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
  isBookmarked = true;
  alert(data.message);
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
      document.getElementById(`coment-text`).innerHTML = html;
}