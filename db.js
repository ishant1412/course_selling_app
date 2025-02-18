const mongoose = require('mongoose');
const { string } = require('zod');
const schema = mongoose.Schema
const objectId= schema.ObjectId;


const userSchema = new schema({
    phonenumber:String,
    username:String,
    password:String,
    email:String,
    pfp:String,
    bio:String,
    courses_purchased:[{
        type:objectId,
        ref:"coursemodel"
    }]
})

const courses_schema= new schema({
    course_name:String,
    course_price:Number,
    course_description:String,
    course_duration:String,
    course_image:String
})

const admin_schema = new schema({
    admin_name:String,
    admin_password:String,
    admin_email:String,
    admin_pfp:String,
    no_of_courses_purchased:Number,

})

const usermodel = mongoose.model("users",userSchema);
const coursemodel= mongoose.model("courses",courses_schema);
const adminmodel = mongoose.model("admins",admin_schema);

module.exports={
    usermodel:usermodel,
    coursemodel:coursemodel,
    adminmodel:adminmodel
}