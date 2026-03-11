const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
         const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader != 'undefined') {
            const bearer = bearerHeader.split(' ')[1]
            const user = jwt.verify(bearer, process.env.JWT_SECRET)
            if(!user){
                localStorage.removeItem('jwtToken')
            }
            req.user = user
            next();
        }
        else {

            res.status(401).json({ message: "No Token Provided" })
        }
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired Token"})
    }
}
module.exports=auth