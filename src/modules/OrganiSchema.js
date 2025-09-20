import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const Organizer = new Schema({
    Name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true
    },
    surname: { 
        type: String, 
        required: [true, 'Surname is required'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phoneNumber: { 
        type: String, 
        required: [true, 'Phone number is required'],
        trim: true
    },
    dateOfBirth: { 
        type: Date, 
        required: [true, 'Date of birth is required']
    },
    gender: { 
        type: String, 
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female', 'other', 'prefer not to say'],
            message: 'Please select a valid gender'
        }
    },
    type: { 
        type: String, 
        required: true, 
        enum: ['organizer'],
        default: 'organizer' 
    }
}, {
    timestamps: true
});

// Hash password before saving
Organizer.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
Organizer.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
Organizer.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

const OrganizerSchema = mongoose.model('Organizer', Organizer);

export default OrganizerSchema;