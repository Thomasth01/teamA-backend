const express = require('express');	
const mongoose = require('mongoose');
const Event = require('./models/eventModel');
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))


//Get data from database

app.get('/events', async (req, res) => {
    try {
        const { category } = req.query;

        // Validate category if provided
        const allowedCategories = ["Music", "Art", "Sports", "Tech", "Education", "Other"];
        if (category && !allowedCategories.includes(category)) {
            return res.status(500).json({
                message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
            });
        }

        // Build the filter object
        const filter = category ? { category } : {};

        // Fetch events from the database with optional category filtering
        const events = await Event.find(filter);

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//Get data by id from database

app.get('/events/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const events = await Event.findById(id);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Get data by category from database
app.get('/events/Category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const events = await Event.find({ category });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Post data in database

app.post('/events', async (req, res) => {
    try {
        const { category } = req.body;

        // Validate category manually against the allowed values
        const allowedCategories = ["Music", "Sports", "Theatre", "Dance", "Workshop", "Cinema"];	
        if (!allowedCategories.includes(category)) {
            return res.status(500).json({
                message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
            });
        }

        // Create the event after validation
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        console.log(error.message);

        // Handle validation errors or other exceptions
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: error.message });
    }
});

//update a Event
app.put('/events/:id', async(req, res) =>{
    try {
        const{id} = req.params;
        const {category} = req.body;
        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Event ID' });
        }

        // Validate category against allowed values
        const allowedCategories = ["Music", "Sports", "Theatre", "Dance", "Workshop" ];	
        if (category && !allowedCategories.includes(category)) {
            return res.status(500).json({
                message: `Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`,
            });
        }

        // Update the event and run validators
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { 
            new: true,       // Return the updated document
            runValidators: true // Ensure validation rules are applied
        });

        // Check if the event exists
        if (!updatedEvent) {
            return res.status(404).json({ message: `Event with ID: ${id} not found.` });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

//delete a Event
app.delete('/events/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const event = await Event.findByIdAndDelete(id);    
        if(!event) {
            return res.status(404).json({message: 'Event with id: ${id} not found.'})
        }   
        res.status(200).json(event);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://kintosmakris:fws1312@eventapi.q65zz.mongodb.net/?retryWrites=true&w=majority&appName=eventAPI')
.then(() => {
    console.log('Connected to MongoDB')

    app.listen(3001, ()=> {
        console.log('Node API app is running on port 3001')
    })

}).catch((error) => {
    console.log(error)
})