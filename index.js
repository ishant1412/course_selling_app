const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const key = "ishant";
const mongoose = require("mongoose");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { usermodel, coursemodel, adminmodel } = require("./db");
mongoose.connect("mongodb+srv://ishant:ishant1234@cluster0.kdiuh.mongodb.net/course_app")
app.use(express.json());
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
         decoded = await jwt.verify(token, key);
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
app.post("/signup", async function (req, res) {
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



app.post("/user/signin", async function (req, res) {
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



app.get("/user/courses", user_auth, async function (req, res) {
    res.sendFile(__dirname + "/html/couses.html")
    res.json({
       
    })
})



app.get("/user/purchase", user_auth, async function (req, res) {
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



app.get("/user/purchased", user_auth, async function (req, res) {
    res.sendFile(__dirname + "/html/purchased.html");
    const id = req.id;

    const user = await usermodel.findById(id);
    const purchased_courses = await user.populate("courses_purchased");
    res.json({
        purchased_courses: purchased_courses
    })


})



app.post("/admin/signup", async function (req, res) {
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



app.post("/admin/signin", async function (req, res) {
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
                }, key)
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



app.get("/admin/create", async function (req, res) {
    res.sendFile(__dirname + "/html/create_course.html")
})

app.post("/admin/create",admin_auth, async function (req, res) {
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



app.post("/admin/delete", admin_auth, async function (req, res) {
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







app.listen(3000);