// Import required modules
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose ORM for MongoDB

// Create an Express app
const app = express(); 

// Middleware to parse incoming JSON requests
app.use(express.json()); 

// Import Event model (Assume the schema is defined elsewhere)
const Event = require('./models/Event');

// Endpoint to fetch all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events from the database
        res.status(200).json(events); // Send the events as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send error message if something goes wrong
    }
});

// Endpoint to fetch an event by its ID
app.get('/events/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID parameter from the URL
        const events = await Event.findById(id); // Find an event by its ID
        res.status(200).json(events); // Send the found event as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send error message if something goes wrong
    }
});

// Endpoint to create a new event
app.post('/events', async (req, res) => {
    try {
        const event = await Event.create(req.body); // Create a new event with the request body
        res.status(200).json(event); // Send the created event as a JSON response
    } catch (error) {
        console.log(error.message); // Log the error to the console for debugging
        res.status(500).json({ message: error.message }); // Send error message if something goes wrong
    }
});

// Endpoint to update an event by its ID
app.put('/events/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID parameter from the URL
        const event = await Event.findByIdAndUpdate(id, req.body); // Update the event with the given ID
        if (!event) { // Check if the event exists
            return res.status(404).json({ message: `Event with id: ${id} not found.` }); // Send a 404 if not found
        }
        const updatedEvent = await Event.findById(id); // Fetch the updated event
        res.status(200).json(updatedEvent); // Send the updated event as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send error message if something goes wrong
    }
});

// Endpoint to delete an event by its ID
app.delete('/events/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID parameter from the URL
        const event = await Event.findByIdAndDelete(id); // Delete the event with the given ID
        if (!event) { // Check if the event exists
            return res.status(404).json({ message: `Event with id: ${id} not found.` }); // Send a 404 if not found
        }
        res.status(200).json(event); // Send the deleted event as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send error message if something goes wrong
    }
});

// Configure Mongoose to use relaxed query parsing
mongoose.set("strictQuery", false);

// Connect to the MongoDB database
mongoose
.connect('mongodb+srv://kintosmakris:fws1312@eventapi.q65zz.mongodb.net/?retryWrites=true&w=majority&appName=eventAPI') // Replace with your connection string
.then(() => {
    console.log('Connected to MongoDB'); // Log successful connection
    app.listen(3001, () => { // Start the Express server on port 3001
        console.log('Node API app is running on port 3001'); // Log server start
    });
})
.catch((error) => {
    console.log(error); // Log any errors during the database connection
});
