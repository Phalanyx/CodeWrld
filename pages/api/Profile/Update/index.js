import prisma from "@/lib/prisma";
import verifyUser from "@/lib/verifyUser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id = decoded.data.id;

      const { firstName, lastName, email, userName, phoneNumber, password } = req.body;

      const updatedData = {
        firstName,
        lastName,
        email,
        userName,
        phoneNumber,
      };

      // Hash the password
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
      }

      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: updatedData
      });
      return res.status(200).json("User updated successfully");
    } 
    catch (error) {
      return res.status(400).json({ error: "username or email already exists" });
    }
  }
}

export default verifyUser(handler); 