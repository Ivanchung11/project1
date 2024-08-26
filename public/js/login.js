window.onload = () => {
    // console.log("Windows Hello")
    const loginFormEle = document.querySelector("#login-form")
    loginFormEle.addEventListener("submit", async (e) => {
        e.preventDefault()
        console.log("Submit")
        const username = e.target.username.value
        const password = e.target.password.value
        const body = {
            username: username,
            password: password
        }

        console.log(body);
        

        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (res.ok) {
            // window.location = "/profile.html"
            console.log("yes");
            
        } else {
            // alert(data.message)
            console.log("no");
            
        }
    })
}