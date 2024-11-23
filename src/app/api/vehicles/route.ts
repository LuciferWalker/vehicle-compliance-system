import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//GET method to fetch vehicles

export async function GET(request: Request) {
    try{
        const {searchParams} = new URL(request.url);
        const vehicleId = searchParams.get('id');

        if(!vehicleId){
            return new Response(
              JSON.stringify({ error: "Vehicle ID is required" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
        }
            // Fetch a specific vehicle by ID

            const vehicle = await prisma.vehicle.findUnique({
                where: {id: vehicleId},
                include: {Citizen:true, Compliance:true}
            });

            if(!vehicle){
                return new Response(JSON.stringify({error: 'Vehicle not found'}),{
                    status:404,
                    headers: {'Content-Type': 'application/json'},
                });
            }

            return new Response(JSON.stringify(vehicle), {
                status:200,
                headers: {'Content-Type': 'application/json'},
            });
            
    } catch(error){
        console.error('Error fetching vehicles:', error);
        return new Response(JSON.stringify({error: 'Failed to fetch vehicle'}), {
            status:500,
            headers:{'Content-Type': 'application/json'},
        });
    } finally{
        await prisma.$disconnect();
    }
}

export async function POST(request: Request){
    try{

        const data = await request.json(); //Parse the request body as json

        //Validate required fields

        if(!data.licensePlate || !data.vin || !data.citizenId) {
            return new Response(JSON.stringify({error:'Missing required fields: licensePlate, vin, or citizenId'}),{
                status: 400,
                headers:{'Content-Type':'application/json'},
            });
        }

        // Check if the given citizenId exists in the database, cause if not then the new vehicle cannot be added

        const citizen = await prisma.citizen.findUnique({
            where:{id: data.citizenId},
        });

        if(!citizen){
            return new Response(JSON.stringify({error:'Invalid citizenId: Citizen does not exist'}),
        {status:400, headers: {'Content-Type':'application/json'}});
        }

        // Create a new vehicle
        const newVehicle = await prisma.vehicle.create({
            data:{
                licensePlate: data.licensePlate,
                vin: data.vin,
                citizenId: data.citizenId,
            },
        });

        return new Response(JSON.stringify(newVehicle),{
            status:201,
            headers:{'Content-Type': 'application/json'},
        });

    }catch(error){
        console.error('Error creating vehicle: ', error);

             return new Response(JSON.stringify({error:'Failed to create vehicle'}), {
               status: 500,
               headers: { "Content-Type": "application/json" },
             });

    } finally{
        await prisma.$disconnect();

    }
}

export async function PUT(request: Request){
    try{

        // Parse the request body
        const data = await request.json();

        // Validate required fields
        if(!data.id){
            return new Response(JSON.stringify({error:'Vehicle ID is required'}),{
                status:400, headers:{'Content-Type':'application/json'}
            });
        }

        //Build the update object dynamically
        const updateData: any={};
        if(data.licensePlate){
            updateData.licensePlate = data.licensePlate;
        }
        if(data.vin){
            updateData.vin = data.vin;
        }
        if(data.citizenId){
            updateData.citizenId = data.citizenId
        }

        //Handle empty PUT requests
        if(Object.keys(updateData).length === 0){
            return new Response(
                JSON.stringify({error: "No fields provided for update"}),
                {
                    status:400,
                    headers:{"Content-Type": "application/json"},
                }
            );
        }

        //Update the vehicle record
        const updatedVehicle = await prisma.vehicle.update({
            where:{id:data.id},
            data:updateData,
        });

        //Return the updated vehicle
        return new Response(
          JSON.stringify(updatedVehicle),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );

    }catch(error){
        return new Response(
          JSON.stringify({ error: "Failed to update vehicle" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );

    }finally{
        await prisma.$disconnect();
    }
}

// export async function DELETE(request: Request){

//     try{

//     //Parse the request
//     const data = await request.json();

//     if(!data.id){
//         return new Response(JSON.stringify({error: "No Vehicle ID provided"}), {
//             status:400,
//             headers:{"Content-Type":"application/json"}
//         });
//     }

//     // Delete the vehicle record
//     const deletedVehicle = await prisma.vehicle.delete({
//         where:{id:data.id}
//     });

//     return new Response(JSON.stringify({message:"Vehicle deleted successfully"}),{
//         status:200,
//         headers:{'Content-Type':'application/json'}
//     });

// } catch(error){
    
//     console.error(error);

//     return new Response(
//        JSON.stringify({ message: "Error in deleting the vehicle" }),
//        {
//          status: 500,
//          headers: { "Content-Type": "application/json" },
//        }
//      );
// } finally{
//     await prisma.$disconnect();
// }

// }