
const mongoose  = require("mongoose");

const eventSchema = mongoose.Schema(
    {
        event_title: {
                 type: String,
                 required: [true, "Please enter a event"]
        },
        location: {
                type: String,
                required: [true, "Please enter the location of the event"],
                default: "TBA"
        },
        date: {
                type: String,
                required: [true, "Please enter the date of the event"],
                default: "TBA",
        },
        category: {
                type: String,
                required: [true, "Please enter the category of the event"],
                enum: ["Music", "Theatre", "Dance", "Workshop","Cinema"],
        },
        ticket_price: {
                type: Number,
                required: true,
                default: 0
        },
        event_image: {
                type: String,
                required: false,
        },
        description: {
                type: String,
                required: false,
                default: "No description available"
        }
    },
    {
        timestamps: true 
    }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
