const Chat = require('../models/chatmodel');


exports.getChatMessages = async (req, res) => {
  const otherUser = req.query.user;
  const currentUser = req.headers['x-user-id'] || req.query.currentUser;

  if (!otherUser) {
    return res.send('User is required.');
  }

  try {
    const messages = await Chat.find({
      $or: [
        { sender: currentUser, receiver: otherUser },
        { sender: otherUser, receiver: currentUser }
      ]
    }).sort('timestamp');

    res.send(messages);
  } catch (err) {
    console.log('Error getting messages:', err);
    res.send('Something went wrong.');
  }
};


exports.sendMessage = async (req, res) => {
  const sender = req.headers['x-user-id'] || req.body.sender;
  const recipient = req.body.recipient;
  const text = req.body.text;

  if (!recipient || !text) {
    return res.send('Recipient and text are required.');
  }

  try {
    const message = new Chat({
      sender,
      receiver: recipient,
      text,
      timestamp: new Date()
    });

    await message.save();
    res.send(message);
  } catch (err) {
    console.log('Error sending message:', err);
    res.send('Something went wrong.');
  }
};
