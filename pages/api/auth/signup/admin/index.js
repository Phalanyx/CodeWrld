import bcrypt from "bcrypt";
import prisma from '@/lib/prisma';

export default async function VerifyAdminKey(req, res) {
    if (req.method !== "POST") {
        return res.status(404).json({ error: "Not Found" });
    }
    const { adminKey } = req.body;
    if (!adminKey) {
        return res.status(400).json({ error: "Bad Request" });
    }
    if (adminKey === process.env.ADMIN_KEY) {
        return handler(req, res);
    } else {
        return res.status(400).json({ error: "Unauthorized" });
    }
}


async function handler(req, res) {

    const { email, userName, firstName, lastName, phoneNumber, password, adminKey } = req.body;
    if (
        !email ||
        !userName ||
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !password ||
        !adminKey
      ) {
        return res.status(400).json({ error: "Bad Request" });
      }
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(400).json({ error: "Bad Request" });
    }

    try {
        const checkExist = await prisma.user.findFirst({
            where: {
                OR: [
                    { userName },
                    { email }
                ]
            },
        });
        if (checkExist) {
            return res.status(400).json({ error: "User with same username or email exists" });
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await prisma.user.create({
            data: {
                email,
                userName,
                firstName,
                lastName,
                phoneNumber,
                password: hashedPassword,
                role: "admin",
            },
          });
        return res.status(201).json({ message: "Admin created" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}