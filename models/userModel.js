const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        image:{
            type:String,
            default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        }
    },{
        timestamps: true
    }
)

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;