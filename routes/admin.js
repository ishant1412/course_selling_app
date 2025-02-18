const {Router} = require("express");
const admin_router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { z } = require("zod");
const { usermodel, coursemodel, adminmodel } = require("../db");

const {admin_auth} = require("../middleware/user"); 
const { JWT_ADMIN_PASSWORD } = require("../config");
const key2 = JWT_ADMIN_PASSWORD;






admin_router.post("/admin/signup", async function (req, res) {
    console.log("request recieved");
    const {admin_name,admin_password,admin_email}=req.body;
 let admin;
     try { 
         
          admin = await adminmodel.findOne({ admin_name: admin_name });
          console.log(admin);
     }
     catch(e){  
         res.json({
             message:"database didnt respond"
         })
     }
    
     
     if(!admin) {
         const hashed_password = await bcrypt.hash(admin_password, 10);
         let errorthrown = false;
         try {
             await adminmodel.create({
                 admin_name: admin_name,
                 admin_password: hashed_password,
                 admin_email: admin_email
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
         console.log(admin)
         return res.json({
             message: 'admin already exist in  database you can signin directly'
         })
     }
 })



admin_router.post("/admin/signin", async function (req, res) {
    const adminname = req.body.admin_name;
    const password = req.body.admin_password;
    const email = req.body.admin_email;
  let admin,token;
    try {
        console.log(adminname);
     admin = await  adminmodel.findOne({admin_name:adminname});
    }
    catch (e) {
        res.status(404).json({
            message: "database is not working properly"
        })
    }
    if (admin) {
        console.log("enterd if")
        const ismatch = await bcrypt.compare(password, admin.admin_password);
        console.log("passed bcrypt")
        console.log("ismatch=="+ismatch)
        if (ismatch) {
            console.log("entered in ismatch if")
            try {
                console.log("entered in try of token generating");
                console.log(admin._id);
                token = await jwt.sign({
                    id: admin._id
                }, key2)
            }
            catch (e) {
                console.log("error in token")
                res.status(404).json({
                    message: "unable to generate token"
                })
            }
            if (token) {
                console.log("enterd in if of token")
                res.header({
                    token: token
                }).json({
                    message: "admin signin successfully",
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



admin_router.get("/admin/create", async function (req, res) {
    res.sendFile(__dirname + "/html/create_course.html")
})



admin_router.post("/admin/create", async function (req, res) {
    const coursename = req.body.course_name;
    const course_price = req.body.course_price;
    const course_description = req.body.course_description;
    const course_duration = req.body.course_duration;
    const course_image = req.body.course_image;
    let error = 0;
    try {
        await coursemodel.create({
            course_name: coursename,
            course_price: course_price,
            course_description: course_description,
            course_duration: course_duration,
            course_image: course_image
        })
    }
    catch (e) {
        error = 1;
        res.json({
            message: "unable to create course"
        })
    }
    if (error == 0) {
        res.json({
            message: "successfully course added"
        })
    }
})



admin_router.post("/admin/delete", async function (req, res) {
    const course_id = req.body.courseid;
    let error = 0;
    try {


        const course = await coursemodel.findByIdAndDelete(course_id);
    }
    catch (e) {
        error = 1;
        res.json({
            message: "unable to delete course"
        })
    }
    if (error == 0) {
        res.json({
            message: "course has been deleted"
        })
    }
})




module.exports={ 

    admin_router:admin_router

}