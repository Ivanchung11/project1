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

// $(document).ready(function () {
//   $('.comic-content .col-12:lt(3)').show();
//   $('.less').hide();
//   var items =  9;
//   var shown =  3;
//   $('.more').click(function () {
//       $('.less').show();
//       shown = $('.comic-content .col-12:visible').length+3;
//       if(shown< items) {
//         $('.comic-content .col-12:lt('+shown+')').show(300);
//       } else {
//         $('.comic-content .col-12:lt('+items+')').show(300);
//         $('.more').hide();
//       }
//   });
//   $('.less').click(function () {
//       $('.comic-content .col-12').not(':lt(3)').hide(300);
//       $('.more').show();
//       $('.less').hide();
//   });
// });
  