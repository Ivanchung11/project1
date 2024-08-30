let commentbtn = document.querySelector("#commentBtn")
commentbtn.addEventListener("click", async(event) => {
    console.log(event.currentTarget);
    document.getElementById("comment").innerHTML = 
    `
    <div id="comment">
    <textarea  id="text" ></textarea>
    <br>
    <button type="submit" id="uploadBtn" class="btn btn-sm btn-outline-secondary">upload</button>
    </div>
    `;

    let uploadbtn = document.querySelector("#uploadBtn")
    uploadbtn.addEventListener("click", async(event) => {
        // event.preventDefault()
        // console.log(event.currentTarget);
        // console.log(event.target);

        const text = await document.getElementById("text").value;
        console.log(text);
        const body = {
            comment : text
        }

        const res = await fetch("/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        document.getElementById("comment").innerHTML = `<div id="comment"> </div>`;
        // const data = await res.json()
        // if (res.ok) {
        //     // alert("comment success")
        //     document.getElementById("comment").innerHTML = `<div id="comment"> </div>`;
        //     console.log("haha");
            
        // } else {
        //     // alert(data.message)
        //     console.log("bye");
            
        // }


        
        
        
        

        
        
        
    });
})


