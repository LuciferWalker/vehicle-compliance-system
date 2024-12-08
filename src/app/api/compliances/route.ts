import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request){

    try{
      // Extract licensePlate from query parameters
      const { searchParams } = new URL(request.url);
      const licensePlate = searchParams.get("licensePlate");

      if (!licensePlate) {
        return new Response(
          JSON.stringify({ error: "License plate is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const vehicle = await prisma.vehicle.findUnique({
        where: { licensePlate },
        include: { Compliance: true },
      });

      if (!vehicle) {
        return new Response(JSON.stringify({ error: "Vehicle not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      //Update the lastChecked field in the database
      await prisma.compliance.update({
        where: { id: vehicle.id },
        data: { lastChecked: new Date() },
      });

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

export async function PUT(request: Request){
    try{

        //Parse the request
        const data = await request.json();

        if(!data.vehicleId){
            return new Response(JSON.stringify({error: "Vehicle ID is required"}), {
                status:400,
                headers:{'Content-Type':'application/json'},
            });
        }

        const compliance = await prisma.compliance.findUnique({
            where: {vehicleId: data.vehicleId},
        });

        if(!compliance){
            return new Response(
              JSON.stringify({
                error: "Compliance record not found for the vehicle",
              }),
              {
                status: 404,
                headers: { "Content-Type": "application/json" },
              }
            );
        }

        if(data.registrationValid == false && data.insuranceValid == true){
              return new Response(JSON.stringify({error: "Insurance cannot be valid for unregistered vehicles"}), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
        }

        //Update the compliance record
        const updatedCompliance = await prisma.compliance.update({
            where: {vehicleId: data.vehicleId},
            data:{
                insuranceValid: data.insuranceValid,
                registrationValid: data.registrationValid,
            },
        });

        //Return the updated record
        return new Response(JSON.stringify(updatedCompliance), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

    }catch(error){

        console.error(error);
         return new Response(JSON.stringify({error: 'Error updating the compliance'}), {
           status: 500,
           headers: { "Content-Type": "application/json" },
         });

    }finally{
        await prisma.$disconnect();
    }
}