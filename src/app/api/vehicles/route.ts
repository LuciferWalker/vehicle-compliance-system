import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//GET method to fetch vehicles

export async function GET(request: Request) {
    try{
        const {searchParams} = new URL(request.url);
        const vehicleId = searchParams.get('id');

        if(vehicleId){
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
        }
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