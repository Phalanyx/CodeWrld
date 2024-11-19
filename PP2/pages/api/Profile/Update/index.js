import prisma from "@/lib/prisma";
import verifyUser from "@/lib/verifyUser";
import jwt from "jsonwebtoken";
async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id = decoded.data.id
      console.log(id);
      const { firstName, lastName, email, userName, phoneNumber } = req.body;
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          firstName,
          lastName,
          email,
          userName,
          phoneNumber,
        },
      });
      return res.status(200).json({ user });
    }
    catch (error){
      console.log(error);
      return res.status(400).json({ error: "username or email already exists" });
    }
  }
}

export default verifyUser(handler);