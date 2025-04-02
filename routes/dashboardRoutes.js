import express from "express";
const router = express.Router();

// **Protected User Route**
router.get("/user", (req, res) => {
    res.json({ message: `Welcome, user ${req.session.user.email}` });
  });
  
// **Protected Admin Route**
router.get("/admin", (req, res) => {
if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
}
res.json({ message: `Welcome, admin ${req.session.user.email}` });
});

export default router;