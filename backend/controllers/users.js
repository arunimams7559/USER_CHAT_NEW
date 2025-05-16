const User = require('../models/usermodel');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); 
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).send('Server error');
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      avatar: user.avatar || 'https://avatar.iran.liara.run/public/boy',
    });
  } catch (err) {
    console.error('Error getting profile:', err);
    res.status(500).send('Server error');
  }
};


exports.setUserOnline = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline });
  } catch (err) {
    console.error('Error updating online status:', err);
  }
};
