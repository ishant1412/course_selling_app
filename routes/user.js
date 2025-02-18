const {Router} = require("express");
const user_router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { z } = require("zod");
const { usermodel, coursemodel, adminmodel } = require("../db");

const {user_auth} = require("../middleware/user");
const {  JWT_USER_PASSWORD} = require("../config");
const key = JWT_USER_PASSWORD;


user_router.post("/signup", async function (req, res) {
    console.log("request recieved");
   const {username,password,email}=req.body;
let user;
    try { 
        
         user = await usermodel.findOne({ username: username });
         console.log(user);
    }
    catch(e){  
        res.json({
            messgae:"database didnt respond"
        })
    }
   
    
    if(!user) {
        const hashed_password = await bcrypt.hash(password,5);
        let errorthrown = false;
        try {
            await usermodel.create({
                username: username,
                password: hashed_password,
                email: email
            })

        }
        catch (e) {
            return res.status(404).json({
                message: "unable to signup"
            })
            errorthrown = true;
        }
        if (!errorthrown) {
            return res.json({
                message: "signup successful"

            })
        }
    }
    else {
        console.log(user)
        return res.json({
            message: 'user already exist in  database you can signin directly'
        })
    }
}) 

  

user_router.post("/user/signin", async function (req, res) {
    console.log("request recieve");
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
  let user,token;
    try {
         user = await usermodel.findOne({username:username});
         console.log(user)
    }
    catch (e) {
        res.status(404).json({
            message: "database is not working properly"
        })
    }
    if (user) {
        const ismatch = await bcrypt.compare(password, user.password);
        if (ismatch) {
            try {
                 token = await jwt.sign({
                    id: user._id
                }, key)
            }
            catch (e) {
                res.status(404).json({
                    message: "unable to generate token"
                })
            }
            if (token) {
                res.header({
                    token: token
                }).json({
                    message: "user signin successfully",
                    token:token
                })
            }
        }
    }
    else {
        res.json({
            message: 'user not found'
        })
    }

})



user_router.get("/user/courses", user_auth, async function (req, res) {
    res.sendFile(__dirname + "/html/couses.html")
    res.json({
       
    })
})



user_router.get("/user/purchase", user_auth, async function (req, res) {
    res.sendFile(__dirname + "/html/purchase");
    const courseid = req.body.courseid;
    try {
        const course = await coursemodel.findById(courseid);
    } catch (e) {
        res.sendjson({
            message: "course not found"
        })
    }
    if (course) {
        res.json({
            course: course
        })
    } else {
        res.json({
            message: "course not found"
        })
    }

})



user_router.get("/user/purchased", user_auth, async function (req, res) {
    res.sendFile(__dirname + "/html/purchased.html");
    const id = req.id;

    const user = await usermodel.findById(id);
    const purchased_courses = await user.populate("courses_purchased");
    res.json({
        purchased_courses: purchased_courses
    })


})

module.exports={
    user_router:user_router
}