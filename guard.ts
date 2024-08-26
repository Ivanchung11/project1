import {Request, Response, NextFunction} from 'express'
export const isLoggedIn = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.session?.userId) {
        next()
      //called Next here
    } else {
        // res.status(401).json({message: "please login first"})
        res.redirect("/login.html")
      // redirect to index page
    }
  };