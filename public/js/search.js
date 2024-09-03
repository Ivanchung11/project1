window.onload = async () => {
    console.log("hello");
  
    searchButtonListener();
  
    let toggles = document.querySelectorAll(".toggle");
    for (let toggle of toggles) {
      toggle.addEventListener("click", () => {
        console.log(toggle.value);
      });
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
  