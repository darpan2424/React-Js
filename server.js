const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    // Read current users
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    
    // Check if user exists
    if (db.users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Add new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password // In a real app, this should be hashed
    };
    
    db.users.push(newUser);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
    
    // Generate token
    const token = 'dummy-token-' + Date.now();
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Read users
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    
    // Find user
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = 'dummy-token-' + Date.now();
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  try {
    // Read users
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    
    // Check if user exists
    if (!db.users.some(user => user.email === email)) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app, send password reset email
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create JSON Server instance
const jsonServerRouter = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Mount JSON Server routes
app.use(middlewares);
app.use('/', jsonServerRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 