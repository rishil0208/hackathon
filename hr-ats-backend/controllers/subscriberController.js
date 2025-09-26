const Subscriber = require('../models/subscriberModel');

exports.addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is already in the database
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }

    // If not, create a new entry
    await Subscriber.create({ email });
    res.status(201).json({ message: 'Thank you for subscribing!' });

  } catch (error) {
    res.status(500).json({ message: 'Subscription failed. Please try again.' });
  }
};