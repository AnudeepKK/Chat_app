const Message = require('../models/message');
const User = require('../models/user');

exports.sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.userId;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  const { chatWithId } = req.params;
  const userId = req.user.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: chatWithId },
        { sender: chatWithId, receiver: userId }
      ]
    }).populate('sender receiver', 'username');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
