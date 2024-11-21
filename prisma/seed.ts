import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main(){
  // 1. Add fake citizens

  const citizen1 = await prisma.citizen.create({
    data: {
      id: "c1",
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
    },
  });

  const citizen2 = await prisma.citizen.create({
    data: {
      id: "c2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phoneNumber: "0987654321",
    },
  });

  console.log("Citizens created: ", { citizen1, citizen2 });

  // 2. Add fake vehicles linked to the citizens
  const vehicle1 = await prisma.vehicle.create({
    data: {
      licensePlate: "ABC123",
      vin: "VIN123",
      citizenId: citizen1.id, // Links to citizen1
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      licensePlate: "XYZ456",
      vin: "VIN456",
      citizenId: citizen2.id, // Links to citizen2
    },
  });

  console.log("Vehicles created:", { vehicle1, vehicle2 });

  // 3. Add compliance records for the vehicles
  const compliance1 = await prisma.compliance.create({
    data: {
      vehicleId: vehicle1.id,
      insuranceValid: true,
      registrationValid: false,
    },
  });

  const compliance2 = await prisma.compliance.create({
    data: {
      vehicleId: vehicle2.id,
      insuranceValid: true,
      registrationValid: true,
    },
  });

  console.log("Compliance records created:", { compliance1, compliance2 });

  console.log("Database seeded successfully!");
}

try{
    main();
} catch(error){
    console.error("Error seeding database: ", error);
} finally{
    await prisma.$disconnect();
}