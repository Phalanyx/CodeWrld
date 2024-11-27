import prisma from '@/lib/prisma';
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  
  if (req.method === "POST") {
    const { email, userName, firstName, lastName, phoneNumber, password } = req.body;

    if (
      !email ||
      !userName ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({ error: "Bad Request" });
    }

    try {
      const userResponse = await prisma.user.findFirst({
        where: {
          OR: [
              { userName },
              { email }
          ]
        },
      });

      if (userResponse) {
        return res.status(400).json({ error: "User with same username or email exists" });
      } 
      else {
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
            role: "user",
          },
        });

        return res.status(201).json({ message: "User created" });
      }
    } 
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } 
  else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
