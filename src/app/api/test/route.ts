import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); //initializing instance of prisma client

export async function GET(request: Request){

    try{
        const users = await prisma.user.findMany(); //returns array of user objects
        return new Response(JSON.stringify(users), {status:200, headers: {'Content-Type': 'application/json'},});
    } catch(error){
        console.error(error);
        return new Response(JSON.stringify({error: 'Something went wrong'}),{
            status:500,
            headers:{'Content-Type': 'application/json'},
        });
    } finally{
        await prisma.$disconnect();
    }
}

