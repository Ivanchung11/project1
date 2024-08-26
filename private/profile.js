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
}
  