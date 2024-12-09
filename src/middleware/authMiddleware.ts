// Intercepts incoming requests and verifies whether the user is
// authenticated by validating the provided JWT

import {NextRequest, NextResponse} from 'next/server';
import {verifyToken} from '../app/utils/auth';

export function middleware(request: NextRequest){
    const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
    try{
        const user = verifyToken(token);
        request.user = user;
        return NextResponse.next(); // Allow the request to rpoceed to its intended destination
    }catch(error){
        return NextResponse.json({error: 'Unauthorized'}, {status:401});
    }
}