window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("route_id");
  console.log(myParam);

  await getComment();
  async function getComment() {
    const res = await fetch("/getAllComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({routeId: myParam}),
      });
      const data = await res.json();
      console.log(data);

    if (res.ok) {
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
    }else {
        alert("error!")
    }
    
  }    

  let commentbtn = document.querySelector("#commentBtn");
  commentbtn.addEventListener("click", async (event) => {
    console.log(event.currentTarget);
    document.getElementById("comment").innerHTML = `
    <div id="comment">
    <textarea  id="text" ></textarea>
    <br>
    <button type="submit" id="uploadBtn" class="btn btn-sm btn-outline-secondary">upload</button>
    </div>
    `;

    let uploadbtn = document.querySelector("#uploadBtn");
    uploadbtn.addEventListener("click", async (event) => {
      const text = await document.getElementById("text").value;
      console.log(text);
      const body = {
        routeId: myParam,
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
      // document.getElementById("comment").innerHTML = `<div id="comment"> </div>`;
      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        alert("comment success");
        document.getElementById(
          "comment"
        ).innerHTML = `<div id="comment"> </div>`;
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
        // console.log("haha");
      } else {
        alert(data.message);
        // console.log("bye");
      }
    });
  });
};
