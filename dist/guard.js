export const isLoggedIn = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId) {
        next();
        //called Next here
    }
    else {
        // res.status(401).json({message: "please login first"})
        res.redirect("/login.html");
        // redirect to index page
    }
};
