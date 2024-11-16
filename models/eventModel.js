const mongoose  = require("mongoose");

const eventSchema = mongoose.Schema(
    {
        event_title: {
                 type: String,
                 required: [true, "Please enter a event"]
        },
        city: {
                type: String,
                required: [true, "Please enter the city of the event"]
        },
        category: {
                type: String,
                required: [true, "Please enter the genre of the event"]
        },
        ticket_price: {
                type: Number,
                required: true,
        },
        event_image: {
                type: String,
                required: false,
        }
    },
    {
        timestamps: true 
    }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;