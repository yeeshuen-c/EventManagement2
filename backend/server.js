// backend/server.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt'); // If you installed bcrypt

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

// Session management
app.use(session({
  secret: 'cmt_secret', // Change this to a strong secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }), // Store sessions in MongoDB
  cookie: { maxAge: 180 * 60 * 1000 } // Session expiration time (3 hours)
}));  

// Define a schema for events and feedback
const eventFeedbackSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  capacity: { type: Number, required: true },
  isPastEvent: { type: Boolean, required: true },
  rating: { type: Number }, 
  feedback: { type: [String] }, // Changed to an array of strings
  experience: { type: [String] }, // Changed to an array of strings
  improvements: { type: [String] }, // Changed to an array of strings
  wouldRecommend: { type: [String] }, // Changed to an array of strings
  category: { type: String } // Optional for feedback
});

// Create a model based on the schema
const EventFeedback = mongoose.model('EventFeedback', eventFeedbackSchema);

// Define a schema for user registration
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

// Create a model based on the user schema
const User = mongoose.model('User', userSchema);

// Define a schema for registration with comments
const registrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequirements: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "EventFeedback", required: true }, // FK to EventFeedback
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // FK to User
    comment: { type: String, required: true } // New comment field
});

// Create a model based on the registration schema
const Registration = mongoose.model('Registration', registrationSchema);

// POST endpoint to receive user feedback
app.post('/api/feedback', async (req, res) => {
  const { eventName, rating, experience, improvements, wouldRecommend, category } = req.body;

  try {
      // Fetch the existing event
      const existingEvent = await EventFeedback.findOne({ eventName });

      if (!existingEvent) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Calculate new average rating
      const existingRatings = existingEvent.rating.map(Number); // Convert to numbers
      existingRatings.push(rating); // Add the new rating
      const newAverageRating = (existingRatings.reduce((a, b) => a + b, 0) / existingRatings.length).toFixed(1); // Calculate average

      // // Update the event feedback
      // existingEvent.rating = existingRatings; // Update ratings array
      existingEvent.feedback = existingEvent.feedback ? [...existingEvent.feedback, ...feedback] : [...feedback]; // Append feedback
      existingEvent.improvements = existingEvent.improvements ? [...existingEvent.improvements, ...improvements] : [...improvements]; // Append improvements
      existingEvent.experience = existingEvent.experience ? [...existingEvent.experience, experience] : [experience]; // Append experience
      existingEvent.wouldRecommend = existingEvent.wouldRecommend ? [...existingEvent.wouldRecommend, wouldRecommend] : [wouldRecommend]; // Append would recommend

      // Update the average rating in the event
      existingEvent.rating = newAverageRating;

      // Save the updated event
      await existingEvent.save();
      res.status(200).json({ message: 'Feedback submitted successfully!', newAverageRating });
  } catch (error) {
      res.status(500).json({ message: 'Error saving feedback', error });
  }
});

// POST endpoint for adding events/activities
app.post('/api/feedback', async (req, res) => {
    const { eventName, image, description, date, time, venue, capacity, isPastEvent } = req.body;

    try {
        const newEvent = new EventFeedback({ eventName, image, description, date, time, venue, capacity, isPastEvent });
        await newEvent.save();
        res.status(201).json({ message: 'Event added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding event', error });
    }
});


// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadsDir = path.join(__dirname, 'uploads'); // Ensure this path is correct
      cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize multer
const upload = multer({ storage });

// POST endpoint for adding events/activities
app.post('/api/events', upload.single('image'), async (req, res) => {
  const { eventName, description, date, time, venue, capacity, isPastEvent } = req.body;
  const image = req.file ? req.file.path : null; // Get the path of the uploaded image

  try {
      const newEvent = new EventFeedback({ eventName, image, description, date, time, venue, capacity, isPastEvent });
      await newEvent.save();
      res.status(201).json({ message: 'Event added successfully!' });
  } catch (error) {
      res.status(500).json({ message: 'Error adding event', error });
  }
});

// GET endpoint for fetching all events
app.get('/api/events', async (req, res) => {
  try {
      const events = await EventFeedback.find(); // Fetch all events from the database
      res.status(200).json(events); // Return the events as JSON
  } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
  }
});

// POST endpoint for user registration
app.post('/api/register', async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
      // Hash the password before storing it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user
      const newUser = new User({
          email,
          password: hashedPassword, // Store the hashed password
          fullName,
          role
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user', error });
  }
});

// POST endpoint for user sign-in
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log('Signing in with:', { email, password });

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      
      // Check if user exists and if the password matches
      if (user) {
          // Assuming you are hashing passwords, use bcrypt to compare
          const isMatch = await bcrypt.compare(password, user.password);
          console.log(isMatch)
          if (isMatch) {
              // Return user email and role
              res.status(200).json({ message: 'Signed in successfully!', user: { email: user.email, role: user.role } });
          } else {
              res.status(401).json({ message: 'Invalid email or password' });
          }
      } else {
          res.status(401).json({ message: 'Invalid email or password' });
      }
  } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ message: 'Error signing in', error });
  }
});

// POST endpoint for registration 
app.post('/api/register-activity', async (req, res) => {
    const { fullName, email, phone, specialRequirements, eventName} = req.body;
    console.log(req.body)
    try {
      // Fetch user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const userId = user._id; // Get user ID
      console.log('user ',userId)

      // Fetch event by event name
      const event = await EventFeedback.findOne({ eventName });
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }
      const eventId = event._id; // Get event ID
      console.log(eventId)

      const newRegistration = new Registration({ fullName, email, phone, specialRequirements, eventId, userId});
      console.log(newRegistration)
      await newRegistration.save();
      res.status(201).json({ message: 'Activity registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering activity', error });
    }
});
// POST endpoint for comments
app.post('/api/comments', async (req, res) => {
  const { activityTitle, comment } = req.body;

  try {
    // Fetch the eventId based on the activityTitle (eventName)
    const event = await EventFeedback.findOne({ eventName: activityTitle });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newComment = new Registration({ eventId: event._id, comment });
    await newComment.save();
    res.status(201).json({ message: 'Comment submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting comment', error });
  }
});

// GET endpoint for fetching a user by email
app.get('/api/users', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Return the user object
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// GET endpoint for fetching an event by event name
app.get('/api/events', async (req, res) => {
  const { eventName } = req.query; // Get eventName from query parameters

  try {
    const event = await EventFeedback.findOne({ eventName }); // Find event by event name
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event); // Return the event object
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});