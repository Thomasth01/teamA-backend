const express = require('express');	
const mongoose = require('mongoose');
const Event = require('./models/eventModel');
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

/*

app.get('/', (req, res) =>{
    res.send('Hello NODE API')
})

app.get('/blog', (req, res) =>{
    res.send('Hello Blog, My name is devtamin')
})

*/

app.listen(3001, ()=> {
    console.log('Node API app is running on port 3001')
})

//Get data from database

app.get('/events', async(req, res) => {
    try{
        const events = await Event.find({});
        res.status(200).json(events);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

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

//Post data in database

app.post('/events', async(req,res) => {
    try {
        const event = await Event.create(req.body)
        res.status(200).json(event);
    } 
    catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }  
})

//update a Event
app.put('/events/:id', async(req, res) =>{
    try {
        const{id} = req.params;
        const event = await Event.findByIdAndUpdate(id, req.body);
        // we cannot find any Event in database
        if (!event) {
            return res.status(404).json({message: 'Event with id: ${id} not found.'})
        }
        const updatedEvent = await Event.findById(id);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

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