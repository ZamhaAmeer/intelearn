require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const { Pool } = require('pg'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer'); 
 
const app = express(); 
app.use(cors()); 
app.use(express.json());  
 
// Set up PostgreSQL connection 
const pool = new Pool({ 
  user: process.env.DB_USER, 
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT, 
}); 
 
// ------------------------------------ 
// THE REGISTER ROUTE 
// ------------------------------------ 
app.post('/register', async (req, res) => { 
  const { email, password, role } = req.body;  
   
  // Removed '!role' because role is not passed during a standard login attempt 
  if (!email || !password) { 
    return res.status(400).json({ error: 'Missing email or password' }); 
  } 
  // ---------------------------------- 
 
  try { 
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', 
[email]); 
    if (userCheck.rows.length > 0) { 
      return res.status(400).json({ error: 'User already exists' }); 
    }
    const saltRounds = 10; 
    const passwordHash = await bcrypt.hash(password, saltRounds); 
 
  const newUser = await pool.query(
  'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
  [email, passwordHash, role]
);
 
    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] 
}); 
  } catch (err) { 
    console.error(err.message); 
    res.status(500).json({ error: 'Server error' }); 
  } 
}); 
 
// ------------------------------------ 
// THE LOGIN ROUTE 
// ------------------------------------ 
app.post('/login', async (req, res) => { 
  const { email, password } = req.body; 
 
  // --- NEW QUICK CHECK ADDED HERE --- 
  if (!email || !password || !role) { 
    return res.status(400).json({ error: 'Missing email, password, or role' }); 
  } 
  // ---------------------------------- 
 
  try { 
    const user = await pool.query('SELECT * FROM users WHERE email = $1', 
[email]); 
    if (user.rows.length === 0) { 
      return res.status(401).json({ error: 'Invalid credentials' }); 
    } 
 
    const validPassword = await bcrypt.compare(password, 
user.rows[0].password_hash); 
    if (!validPassword) { 
      return res.status(401).json({ error: 'Invalid credentials' }); 
    } 
 
    const token = jwt.sign( 
      { id: user.rows[0].id, role: user.rows[0].role },  
      process.env.JWT_SECRET,  
      { expiresIn: '1h' } 
    );
    res.json({ token, role: user.rows[0].role, message: 'Login successful' }); 
} catch (err) { 
console.error(err.message); 
res.status(500).json({ error: 'Server error' }); 
} 
}); 
// Start the server 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
console.log(`Server running on port ${PORT}`); 
}); 