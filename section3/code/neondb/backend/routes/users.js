const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// (GET) อ่านข้อมูลทั้งหมด: /api/users/
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// (GET) อ่านข้อมูลเฉพาะ 1 คน: /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const foundUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!foundUser) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ในระบบ" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// (POST) สร้างข้อมูลใหม่: /api/users/
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    console.log("🔥 ได้รับข้อมูล Request Body:", req.body);

    const newUser = await prisma.user.create({
      data: { name, email, role: role || "user" },
    });

    res.status(201).json({
      message: "สร้างผู้ใช้สำเร็จ!",
      data: newUser,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "อีเมลอาจซ้ำ หรือมีบางอย่างผิดพลาดในการสร้าง" });
  }
});

// (PUT) แก้ไขข้อมูล: /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({
      message: "แก้ไขข้อมูลสำเร็จ!",
      data: updatedUser
    });
  } catch (error) {
    console.log("Error:", error);
    // Prisma throws a known error if record not found during update (P2025)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการแก้ไข" });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" });
  }
});

// (DELETE) ลบข้อมูล: /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({
      message: "ลบผู้ใช้สำเร็จ!",
      data: deletedUser
    });
  } catch (error) {
    console.log("Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการลบ" });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
});

module.exports = router;
