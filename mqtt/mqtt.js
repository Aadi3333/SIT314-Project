// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const config = require('./config/keys');
const url = config.MongoURI;

const options = {
    authSource: 'admin',
    user: config.user,
    pass: config.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(url, options)
    .then(() => {
        console.log('Connected successfully to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

const floor = require("./models/floor");
const room = require("./models/room");
const light = require("./models/light");

const app = express();
const port = 5001;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up MQTT client
const client = mqtt.connect(config.mqttURI, {
    port: config.mqttPort,
    username: config.username,
    password: config.password
});

client.on('connect', () => {
    client.subscribe('/nodes/command/#', (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`subscribed to /nodes`);
        }
    });
    client.subscribe('/nodes/temp/#', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('subscribed on /nodes/temp/#')
        }
    })
    console.log('mqtt connected');
})

client.on('error', function (error) {
    console.error('MQTT connection error:', error);
});



app.get('/api/viewFloors', async (req, res) => {
    try {
        const floors = await floor.find({});
        // Use a more structured response format
        return res.status(200).json({ success: true, data: floors });
    } catch (error) {
        console.error(error);
        // Handle specific error scenarios and return appropriate status codes
        return res.status(500).json({ success: false, error: 'An error occurred while retrieving the data.' });
    }
});


app.get('/api/viewRooms/:floor', async (req, res) => {
    try {
        const rooms = await room.find({ "floor": req.params.floor });
        // Check if rooms exist for the given floor
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ success: false, error: 'No rooms found for the specified floor.' });
        }
        // Use a more structured response format
        return res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        console.error(error);
        // Handle specific error scenarios and return appropriate status codes
        return res.status(500).json({ success: false, error: 'An error occurred while retrieving the data' });
    }
});

app.get('/api/viewLights', async (req, res) => {
    try {
        const room = req.query.room;
        const floor = req.query.floor;

        // Check if all required parameters are provided
        if (!room || !floor) {
            return res.status(400).json({ success: false, error: 'Invalid parameters. Please provide room and floor.' });
        }

        const lights = await light.find({ "room": room, "floor": floor });

        // Check if lights exist for the specified parameters
        if (!lights || lights.length === 0) {
            return res.status(404).json({ success: false, error: 'No lights found for the specified room and floor.' });
        }

        // Use a more structured response format
        return res.status(200).json({ success: true, data: lights });
    } catch (error) {
        console.error(error);
        // Handle specific error scenarios and return appropriate status codes
        return res.status(500).json({ success: false, error: 'An error occurred while retrieving the data.' });
    }
});


app.get('/api/viewLightSystem', async (req, res) => {
    try {
        const { room, floor } = req.query;

        // If parameters are provided, filter lights based on the parameters
        const filter = room && floor ? { "room": room, "floor": floor } : {};

        const lights = await light.find(filter);

        // Check if lights exist
        if (!lights || lights.length === 0) {
            return res.status(404).json({ success: false, error: 'No lights found based on the provided parameters.' });
        }

        // Use a more structured response format
        return res.status(200).json({ success: true, data: lights });
    } catch (error) {
        console.error(error);
        // Handle specific error scenarios and return appropriate status codes
        return res.status(500).json({ success: false, error: 'An error occurred while retrieving the data.' });
    }
});


app.post('/api/addFloor', async (req, res) => {
    try {
        const { name } = req.body;

        // Validate if the required parameter is provided
        if (!name) {
            return res.status(400).json({ error: 'Please provide a floor name.' });
        }

        const newFloor = new floor({ name });
        await newFloor.save();

        return res.status(201).json({ message: 'New floor added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while saving data.' });
    }
});


app.post('/api/addRoom', async (req, res) => {
    try {
        const { roomName, floorId } = req.body;

        // Validate if the required parameters are provided
        if (!roomName || !floorId) {
            return res.status(400).json({ success: false, error: 'Please provide a room name and floor ID.' });
        }

        const newRoom = await room.create({ name: roomName, floor: floorId });
        return res.status(201).json({ success: true, data: newRoom });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'An error occurred while adding the room.' });
    }
});


app.post('/api/addLight', async (req, res) => {
    try {
        const { lightName, room, floor } = req.body;

        // Validate if the required parameters are provided
        if (!lightName || !room || !floor) {
            return res.status(400).json({ success: false, error: 'Please provide a light name, room, and floor.' });
        }

        const newLight = await light.create({ name: lightName, room, floor });
        return res.status(201).json({ success: true, data: newLight });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'An error occurred while adding the light.' });
    }
});



app.listen(port, () => {
	console.log(`listening on port ${port}`);
});