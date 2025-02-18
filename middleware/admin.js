const jwt= require("jsonwebtoken");
const key2=require("../config")

async function admin_auth(req,res,next) {
    let token,decoded,admin;
    try {
       token =  req.headers.token;
       
    } catch (e) {
        res.staus(404).json({
            message: "token not found login first"
        })
        return;
    }
    try {
         decoded = await jwt.verify(token, key2);
    } catch (e) {
        res.status(404).json({
            message: "token invalid"
        })
        return;
    }
    try {
        
 admin = await usermodel.findById(decoded.id);
    }
    catch (e) {
        res.status(404).json({
            message: "admin not found"
        })
        return;
    }

    if (admin) {
        console.log(admin_id)
        req.id = admin._id;
        next();
       
    }


}

module.export={
    admin_auth
}