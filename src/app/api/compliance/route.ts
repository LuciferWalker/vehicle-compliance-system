import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request){

    try{
        // Extract licensePlate from query parameters
        const {searchParams} = new URL(request.url);
        const licensePlate = searchParams.get("licensePlate");

        if(!licensePlate){
            return new Response(JSON.stringify({error:"License plate is required"}),{
                status:400,
                headers:{'Content-Type':'application/json'},
            });
        }

        const vehicle = await prisma.vehicle.findUnique({
            where: {licensePlate},
            include:{Compliance:true},
        });
        
        if (!vehicle) {
            return new Response(
            JSON.stringify({ error: "Vehicle not found" }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
            );
        }

        return new Response(JSON.stringify({ vehicle }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

    } catch(error){

        return new Response(
          JSON.stringify({ error: "Failed to fetch compliance data" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );

    } finally{
        await prisma.$disconnect();
    }

}