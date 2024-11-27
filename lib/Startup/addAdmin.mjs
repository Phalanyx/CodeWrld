import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function addAdmin() {

    const adminData = {
        "email": "op@gmail.com",
        "userName": "oskip123",
        "firstName": "Oscar",
        "lastName": "Pang",
        "phoneNumber": "+1234567890",
        "password": "securePassword123!",
      }
    var data = null
    try {

        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

        data = await prisma.user.create({
            data: {
                email: adminData.email,
                userName: adminData.userName,
                firstName: adminData.firstName,
                lastName: adminData.lastName,
                phoneNumber: adminData.phoneNumber,
                password: hashedPassword,
                role: "admin",
            },
        });
    }
    catch (err) {
        console.error(err)
    }
    finally {
        await prisma.$disconnect()
    }
    return data
}

addAdmin()