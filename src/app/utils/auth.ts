import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Defining the structure of the payload returned by jwt.verify
interface UserPayload {
    id: string;
    role: string;
}


// Generate JWT
export const generateToken = (userId: string, userRole: string) => {
    return jwt.sign({id:userId, role: userRole}, process.env.JWT_SECRET as string, {expiresIn: process.env.JWT_EXPIRES_IN});
};

// Verify JWT
export const verifyToken = (token: string) =>{
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    return jwtPayload;
}