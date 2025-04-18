import pg from "pg";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});


class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // ✅ Create a new user
  static async createUser(name, email, password) {

    const  hashedPassword = await bcryptjs.hash(password, 10);

    console.log('Im in createUser function inside Usermodel ', hashedPassword)
    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]

    );
    return new User(result.rows[0].name, result.rows[0].email, result.rows[0].password);
  }

  // ✅ Get all users
  static async getAllUsers() {
    const result = await db.query("SELECT id, name, email, user_role_name, tenant_id FROM users");

    const users = result.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.user_role_name,
      tenant: user.tenant_id,
    }));
  
    return users;
  }

  // ✅ Find user by ID
  static async getUserById(id) {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    return new User(result.rows[0].id, result.rows[0].email, null, result.rows[0].role);
  }

  // ✅ Find user by email
  static async getUserByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return null;
    return new User(result.rows[0].id, result.rows[0].email, result.rows[0].password, result.rows[0].role);
  }

  // ✅ Update user role
  static async updateRole(id, newRole) {
    await db.query("UPDATE users SET role = $1 WHERE id = $2", [newRole, id]);
  }

  // ✅ Delete user
  static async deleteUser(id) {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
  }
}


export default User;
