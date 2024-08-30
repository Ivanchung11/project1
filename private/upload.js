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
  
    const logout = document.querySelector("#logout");
  
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

  let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 22.32574171900254, lng: 114.16718211578858 },
    zoom: 11,
  });
}

initMap();
  
  
    