// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')

import {Schema, model, Document} from 'mongoose'

export interface IUser extends Document {
    email: string;
    password?: string;
    createdAt: Date;
    isVerified: boolean;
    verificationCode?: string;
    closingDay: number;
}


const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
         default: false
    },
    verificationCode: {
        type: String
    },
    
        closingDay: {
            type: Number,
            default: 1,
            min: 1,
            max: 31
        }
    
})

export const User = model<IUser>('User', UserSchema)

