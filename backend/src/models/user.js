const db = require('../config/db');

const createTable = async () => {
  const result = await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) NOT NULL,
      email VARCHAR(60) NOT NULL UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20),
      image TEXT DEFAULT NULL,
      login_provider VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Users table created successfully');
  return result;
};

// Create a new user
const create = async (username, email, login_provider, role, hashedPassword = '', image = '') => {
  const query = `
    INSERT INTO users (username, email, password, role, login_provider, image)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (email) DO UPDATE 
    SET 
      username = users.username, -- Preserve existing username
      email = users.email,       -- Preserve existing email
      role = users.role,         -- Preserve existing role
      image = users.image,       -- Preserve existing image
      login_provider = users.login_provider -- Preserve existing login_provider
    RETURNING 
      id, 
      username, 
      email, 
      role, 
      login_provider, 
      image,
      CASE WHEN xmax = 0 THEN TRUE ELSE FALSE END AS is_new_user;
  `;

  const result = await db.query(query, [username, email, hashedPassword, role, login_provider, image]);

  return result.rows[0] || null; // Return the user details or null if no rows are returned
};

// Get user by email without password
const getByEmail = async (email) => {
  const result = await db.query('SELECT id, username, email, role, image, login_provider, created_at FROM users WHERE email = $1;', [email]);
  return result.rows[0] || null;
};


// Get user with password by email (for login validation)
const getUserWithPasswordByEmail = async (email) => {
  const result = await db.query('SELECT id,username,email,password, role,image,login_provider FROM users WHERE email = $1;', [email]);
  return result.rows[0] || null;
};

// Update user's username, email, and image
const update = async (user_id, username, email, image) => {
  const query = `
      UPDATE users
      SET 
        username = $1,
        email = CASE WHEN login_provider = 'credential' THEN $2 ELSE email END,
        image = $3
      WHERE id = $4
      RETURNING id;
    `;
  const result = await db.query(query, [username, email, image, user_id]);
  return result.rows[0] || null; // Return updated data, or null if no rows updated
};

// Update user's username, email, and image
const updateImage = async (user_id, image) => {
  const query = `
      UPDATE users
      SET 
        image = $2
      WHERE id = $1
      RETURNING id;
    `;
  const result = await db.query(query, [user_id, image]);
  return result.rows[0] || null; // Return updated data, or null if no rows updated
};

// Remove user by ID
const remove = async (id) => {
  const result = await db.query(
    'DELETE FROM users WHERE id = $1 RETURNING id;',
    [id]
  );

  return result.rows[0] || null; // Return true if deletion was successful, false otherwise
};

// Get user by ID without password
const getById = async (id) => {
  const result = await db.query('SELECT id, username, email, role, image, login_provider, created_at FROM users WHERE id = $1;', [id]);
  return result.rows[0] || null;
};

module.exports = { createTable, create, getByEmail, getUserWithPasswordByEmail, update,updateImage, remove, getById };