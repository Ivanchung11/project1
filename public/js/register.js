window.onload = () => {
    // console.log("Windows Hello")
    const loginFormEle = document.querySelector("#register-form")
    loginFormEle.addEventListener("submit", async (e) => {
        e.preventDefault()
        console.log("register")

        const username = e.target.username.value
        const password = e.target.password.value
        const email = e.target.email.value
        const body = {
            username: username,
            password: password,
            nickname: email,
        }

        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (res.ok) {
            alert("register success")
            window.location = "/login.html"
            // console.log("haha");
            
        } else {
            alert(data.message)
            // console.log("bye");
            
        }
    })
}