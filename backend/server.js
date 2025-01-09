// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an instance of the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/exploration_bridge'; // Change this to your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a schema for user input
const feedbackSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  rating: { type: String, required: true },
  experience: { type: String, required: true },
  improvements: { type: String },
  wouldRecommend: { type: String, required: true },
  category: { type: String, required: true }
});

// Create a model based on the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

// POST endpoint to receive user feedback
app.post('/api/feedback', async (req, res) => {
  const { eventName, rating, experience, improvements, wouldRecommend, category } = req.body;

  try {
    const newFeedback = new Feedback({ eventName, rating, experience, improvements, wouldRecommend, category });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving feedback', error });
  }
});

// Define a schema for user registration
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
  });
  
  // Create a model based on the schema
  const User = mongoose.model('User', userSchema);
  
  // POST endpoint for user registration
  app.post('/api/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;
  
    try {
      const newUser = new User({ fullName, email, password, role });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  });
  
  // POST endpoint for user sign-in
  app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        res.status(200).json({ message: 'Sign in successful!', user });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error signing in', error });
    }
  });

// Define a schema for activity registration
const registeractivitySchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequirements: { type: String },
    eventName: { type: String, required: true }
  });
  
// Create a model based on the schema
const RegisterActivity = mongoose.model('RegisterActivity', registeractivitySchema);

// POST endpoint for activity registration
app.post('/api/register-activity', async (req, res) => {
const { fullName, email, phone, specialRequirements, eventName } = req.body;

try {
    const newRegisterActivity = new RegisterActivity({ fullName, email, phone, specialRequirements, eventName });
    await newRegisterActivity.save();
    res.status(201).json({ message: 'Activity registered successfully!' });
} catch (error) {
    res.status(500).json({ message: 'Error registering activity', error });
}
});  

// Define a schema for activities
const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    capacity: { type: Number, required: true },
    details: { type: String, required: true },
    isPastEvent: { type: Boolean, required: true },
    feedback: { type: String },
    rating: { type: Number }
  });
  
  // Sample data (you can replace this with actual data from your database)
  const sampleActivities = [
    {
      title: "International Symposium",
      image: "images/science.png",
      description: "国际未来研讨会\n带你探索新纪元",
      date: "2024-04-15",
      time: "09:00 AM",
      venue: "Main Hall, USM",
      capacity: 100,
      details: "Join us for an exciting international symposium where experts from around the world share their insights.",
      isPastEvent: false
    },
    {
      title: "Cultural Exchange Workshop",
      image: "images/scholar.png",
      description: "文化交流工作坊\n共创美好未来",
      date: "2023-05-20",
      time: "02:00 PM",
      venue: "Workshop Room A",
      capacity: 50,
      details: "Experience different cultures through interactive workshops and activities.",
      isPastEvent: true,
      feedback: "Great event! Learned a lot about different cultures.",
      rating: 4.5
    },
    {
      title: "Industry-Academia Docking Forum",
      image: "images/region.png",
      description: "产学对接论坛\n共创美好未来",
      date: "2023-06-10",
      time: "10:00 AM",
      venue: "Conference Hall",
      capacity: 75,
      details: "Bridge the gap between industry and academia in this networking forum.",
      isPastEvent: true,
      feedback: "Very informative and well-organized.",
      rating: 4.7
    }
  ];

  
// GET endpoint to fetch activities
app.get('/api/activities', async (req, res) => {
    try {
      // Here you can fetch from the database or return sample data
      const activities = await Activity.find(); // Fetch from the database
      // If you want to return sample data instead, uncomment the line below
      // const activities = sampleActivities;
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching activities', error });
    }
  });


// Define a schema for comments
const commentSchema = new mongoose.Schema({
    activityTitle: { type: String, required: true },
    comment: { type: String, required: true }
  });
  
  // Create a model based on the schema
  const Comment = mongoose.model('Comment', commentSchema);
  
  // POST endpoint for comments
  app.post('/api/comments', async (req, res) => {
    const { activityTitle, comment } = req.body;
  
    try {
      const newComment = new Comment({ activityTitle, comment });
      await newComment.save();
      res.status(201).json({ message: 'Comment submitted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting comment', error });
    }
  });

// Create a model based on the schema
const Activity = mongoose.model('Activity', activitySchema);

// POST endpoint for adding events/activities
app.post('/api/events', async (req, res) => {
  const { title, image, description, date, time, venue, capacity, details, isPastEvent } = req.body;

  try {
      const newActivity = new Activity({ title, image, description, date, time, venue, capacity, details, isPastEvent });
      await newActivity.save();
      res.status(201).json({ message: 'Event added successfully!' });
  } catch (error) {
      res.status(500).json({ message: 'Error adding event', error });
  }
});

// GET endpoint to fetch activities/events
app.get('/api/events', async (req, res) => {
  try {
      const activities = await Activity.find();
      res.status(200).json(activities);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
  }
});  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});