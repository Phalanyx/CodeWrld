const cookie = require("cookie");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      res.setHeader("Set-Cookie", cookie.serialize("token", ""));
      return res.json(
        { message: "Signed out", success: true },
        { status: 200 }
      );
    } catch (err) {
      return res.json({ error: err.message }, { status: 500 });
    }
  } else {
    return res.status(404).json({ error: "Not Found" });
  }
}
