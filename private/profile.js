window.onload = async () => {
  const usernameLabel = document.querySelector("#username");
  
  await getProfile(usernameLabel);
  
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

// async function profileBookmark() {
//   const res = await fetch("/profileBookmark");
//   const data = await res.json();
//   console.log(data);
  
//   if (res.ok) {
//       // console.log(data.row.username);
//       console.log("yes");
      

//       // const rows = data.row;
//       // usernameLabel.innerHTML = rows.name;
//     } else {
//       // alert("error !!!");
//       console.log("no");
      
//     }
  
// }

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
  