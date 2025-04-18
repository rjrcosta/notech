// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import express from 'express';

// Middleware to check if user is logged in and has the right role and is redirected correctly
const adminRoles = ["super_admin", "admin"];
const userRoles = ["owner", "manager", "analyst"];

export function getRedirectPath(role, currentPath) {
  if (role) {
    if (adminRoles.includes(role)) {
      if (currentPath === "/dashboard/user") { // Check if the user is trying to access the user dashboard
        return "/dashboard/admin"; // Redirect to admin dashboard if user is an admin   
      }
      return "/dashboard/admin";
    }

    if (userRoles.includes(role)) {
      if (currentPath === "/dashboard/admin") { // Check if the user is trying to access the admin
        return "/dashboard/user"; // Redirect to user dashboard if user is a user 
      }
      return "/dashboard/user";
    }
  }
  else {
    return "/auth/sign-in"; // Redirect to sign-in page if no role is found
  }
}


// Middleware to protect admin routes
export function authorizeAdmin(req, res, next) {
  const token = req.session?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.payload.role;
    console.log('User role in authorizeAdmin:', userRole)

    if (!adminRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    req.user = decoded.payload; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// Middleware to protect admin routes
export function authorizeUser(req, res, next) {
  const token = req.session?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.payload.role;
    console.log('User role in authorizeUser:', userRole)

    if (!userRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Not a regular user" });
    }

    req.user = decoded.payload; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

  // return res.status(403).json({ message: "Access denied" });