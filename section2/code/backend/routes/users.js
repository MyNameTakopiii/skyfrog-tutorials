const express = require("express");
const router = express.Router();

// จำลองฐานข้อมูลแบบ Array แบบด่วนๆ สำหรับ Workshop Session 1-2
let fakeDatabase = [
  { id: 1, name: "สมชาย", role: "Admin", department: "IT" },
  { id: 2, name: "สมหญิง", role: "User", department: "HR" },
  { id: 99, name: "ตัวตึง", role: "Super Admin", department: "Management" }
];

// (GET) อ่านข้อมูลทั้งหมด: /api/users/
router.get("/", (req, res) => {
  res.status(200).json(fakeDatabase);
});

// (GET) อ่านข้อมูลเฉพาะ 1 คน (Dynamic / Parameter): /api/users/:id
router.get("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const foundUser = fakeDatabase.find(user => user.id === userId);

  if (!foundUser) {
    return res.status(404).json({ error: "ไม่พบผู้ใช้ในระบบ" });
  }

  res.status(200).json(foundUser);
});

// (POST) สร้างข้อมูลใหม่: /api/users/
router.post("/", (req, res) => {
  const newUser = req.body; 

  console.log("🔥 ได้รับข้อมูล Request Body:", newUser);
  
  // จำลองการสร้าง ID ใหม่
  const newId = fakeDatabase.length > 0 ? Math.max(...fakeDatabase.map(u => u.id)) + 1 : 1;
  const userToSave = { id: newId, ...newUser };
  
  fakeDatabase.push(userToSave);

  res.status(201).json({
    message: "สร้างผู้ใช้สำเร็จ!",
    data: userToSave,
  });
});

// (PUT) แก้ไขข้อมูล: /api/users/:id
router.put("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updateData = req.body;

  const userIndex = fakeDatabase.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการแก้ไข" });
  }

  // อัปเดตข้อมูลเดิมด้วยข้อมูลใหม่
  fakeDatabase[userIndex] = { ...fakeDatabase[userIndex], ...updateData };

  res.status(200).json({
    message: "แก้ไขข้อมูลสำเร็จ!",
    data: fakeDatabase[userIndex]
  });
});

// (DELETE) ลบข้อมูล: /api/users/:id
router.delete("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = fakeDatabase.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการลบ" });
  }

  const deletedUser = fakeDatabase.splice(userIndex, 1);

  res.status(200).json({
    message: "ลบผู้ใช้สำเร็จ!",
    data: deletedUser[0]
  });
});

module.exports = router;
