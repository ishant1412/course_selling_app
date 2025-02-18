const jwt= require("jsonwebtoken");
const {key} = require("../config");



async function user_auth(req, res, next) {
    let decoded,user,token;
    try {
         token =  req.headers.token;
        console.log("got the token");
        console.log(token)
    } catch (e) {
        res.staus(404).json({
            message: "token not found login first"
        })
        return;
    }
    try {
         decoded = await jwt.verify(token, key);
        console.log("decoded token");
    } catch (e) {
        res.status(404).json({
            message: "token invalid"
        })
        return;
    }
    try {

         user = await usermodel.findById(decoded.id);
        console.log(user) 
    }
    catch (e) {
        res.status(404).json({
            message: "user not found"
        })
        return;
    }

    if (user) {
        console.log(user._id)
        req.id = user._id;
        next();
      
    }


}
module.exports = {
    user_auth
}