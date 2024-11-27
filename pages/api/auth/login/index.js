import prisma from '@/lib/prisma';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userName, password } = req.body;

    if ((!userName) || !password) {
      return res.status(400).json({ error: "Bad Request" });
    }
    
    try {
      const userResponse = await prisma.user.findFirstOrThrow({
        where: {
          OR: [
            { userName },
          ]
        },
      });

      const isCorrectPassword = await bcrypt.compare(
        password,
        userResponse.password
      );

      if (!isCorrectPassword || !userResponse) {
        return res.status(401).json({ error: "Incorrect credentials" });
      }

      //JWT
      const accessData = {
        userName: userResponse.userName,
        id: userResponse.id,
        role: userResponse.role
      };

      const refreshData = {
        id: userResponse.id
      }
      const accessToken = jwt.sign(
        {
          data: accessData,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          data: refreshData,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, userID: accessData.id});

    } 
    catch (err) {
      return res.status(400).json({ error: "Login unsuccessful" });
    }
  } 

}