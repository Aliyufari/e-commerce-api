import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserInterface, UserModel } from '../types';

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
      phone: {
        type: String,
        required: [true, 'Phone is required'],
        unique: true,
        trim: true,
        minlength: [11, 'Phone must be 11 characters'],
        maxlength: [11, 'Phone cannot exceed 11 characters']
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
          values: ['Male', 'Female'],
          message: '{VALUE} is not a valid gender option'
        }
      },
      role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
      },      
      isActive: {
        type: Boolean,
        default: true
      },
      avatar: {
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

// Hashed password
userSchema.pre<UserInterface>('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        console.error('Error hashing password: ', error);
        next(error);
    }
});

// Hide password and others in response
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        ret.last_login = ret.lastLogin;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.lastLogin;
        delete ret.password;
    
        // Return just name from role
        if (ret.role && ret.role._id) {
            ret.role = ret.role.name; 
        }

        return ret;
    }
});  

// Compare password before using it
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Design Response
userSchema.statics.findByEmail = function(email: string) {
    return this.findOne({ email });
};

userSchema.plugin(mongoosePaginate);

export const User = model<UserInterface, UserModel<UserInterface>>('User', userSchema);