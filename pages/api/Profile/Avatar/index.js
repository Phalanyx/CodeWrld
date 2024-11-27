import prisma from "@/lib/prisma";
import verifyUser from "@/lib/verifyUser";
import fs from "node:fs/promises";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function modifyAvatar(req, res) {
  if (req.method === "POST") {
    try {
      const userId = req.user.id;
      const form = formidable({ multiples: false });
      const data = await form.parse(req);
      const file = data[1].file[0];
      if (!file) {
        return res.json({ error: "Bad request" }, { status: 400 });
      }

      const fileBuffer = await fs.readFile(file.filepath);
        const base64Image = fileBuffer.toString("base64");

        const response = await prisma.user.update({
          where: { id: userId },
          data: {
            avatar: base64Image,
          },
        });
      return res.json(
        {
          success: true,
          data: response,
        },
        { status: 200 }
      );
    } catch (err) {
      return res.json({ error: err.message }, { status: 500 });
    }
  } else {
    return res.status(404).json({ error: "Not Found" });
  }
}

export default verifyUser(modifyAvatar);