const express = require('express');
const mongoose = require('mongoose');
const User = require('./User'); // Import model User

// Tạo đối tượng mới cho express
const app = express();
app.set('view engine', 'ejs');

// Kết nối với cơ sở dữ liệu MongoDB
const mongoURI = 'mongodb://localhost:27017/test';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Kết nối thành công với MongoDB");
}).catch((err) => {
  console.error('Lỗi:', err);
});

// Middleware để parse JSON
app.use(express.json());

// Định nghĩa route cơ bản
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API để tạo người dùng mới
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/// chức năng sửa
app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// API để lấy danh sách người dùng
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.render('view', { users }); // Render dữ liệu lên file users.ejs
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Khởi chạy máy chủ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});
