import connectDB from "../../../utils/db.js";
import Department from "../../../models/Department.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const depts = await Department.find();
    return res.status(200).json(depts);
  }

  if (req.method === "POST") {
    try {
      const d = new Department(req.body);
      await d.save();
      return res.status(201).json(d);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}