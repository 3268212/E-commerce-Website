import mongoose  from "mongoose";
import brcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await brcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await brcrypt.genSalt(10);
    this.password = await brcrypt.hash(this.password, salt);
});


const User = mongoose.model("User",userSchema);

export default User;