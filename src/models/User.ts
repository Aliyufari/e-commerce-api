import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserInterface, UserModel } from '../interfaces/UserInterface';

const userSchema: Schema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
      },
      gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
          values: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
          message: '{VALUE} is not a valid gender option'
        }
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      isActive: {
        type: Boolean,
        default: true
      },
      profilePicture: {
        type: String,
        default: ''
      },
      lastLogin: {
        type: Date
      }
    },
    {
      timestamps: true
    }
);

userSchema.pre<UserInterface>('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next()
    } catch (error: any) {
        next(error)
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.statics.findByEmail = function(email: string) {
    return this.findOne({ email });
};

userSchema.plugin(mongoosePaginate);

export const User = mongoose.model<UserInterface, UserModel<UserInterface>>('User', userSchema);