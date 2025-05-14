const User = require('../models/usermodel');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log('Error getting users:', err);
    res.send('Server error');
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne(); 
    if (!user) {
      return res.send('User not found');
    }

    res.send({
      username: user.username,
      email: user.email,
      avatar: user.avatar || 'https://avatar.iran.liara.run/public/boy'
    });
  } catch (err) {
    console.log('Error getting profile:', err);
    res.send('Server error');
  }
};


exports.setUserOnline = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline });
  } catch (err) {
    console.log('Error updating online status:', err);
  }
};
