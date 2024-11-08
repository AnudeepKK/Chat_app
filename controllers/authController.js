const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Message = require('../models/message');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, password: password, role });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = (user.password === password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAlumniUsers = async (req, res) => {
    try {
      // Fetch users with role 'Alumni'
      const alumniUsers = await User.find({ role: 'Alumni' });
      
      if (alumniUsers.length === 0) {
        return res.status(404).json({ message: 'No Alumni users found' });
      }
  
      res.status(200).json(alumniUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching alumni users', error });
    }
  };

  
  exports.getStudentMessengers = async (req, res) => {
    try {
      // Ensure the request is coming from an alumni user
      if (req.user.role !== 'Alumni') {
        return res.status(403).json({ message: 'Access denied. Only alumni can access this resource.' });
      }
  
      // Retrieve distinct student IDs who have sent messages to the current alumni
      const studentIds = await Message.distinct('sender', { receiver: req.user.userId });
      console.log(req.user._id);
      // Fetch details of students who have messaged this alumni
      const students = await User.find({ _id: { $in: studentIds }, role: 'Student' });
      
      // Return 404 if no students are found
      if (students.length === 0) {
        return res.status(404).json({ message: 'No students have messaged this alumni.' });
        console.log("No students have messaged this alumni."); 
      }
  
      // Respond with student details
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching student messengers', error });
    }
  };
  