const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Get one message
router.get('/:id', getMessage, (req, res) => {
    res.json(res.message)
})

// Create one message
router.post('/', async (req, res) => {
    const message = new Message({
        message: req.body.message,
        sender: req.body.sender
    });
    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Update one message
router.patch('/:id', getMessage, async (req, res) => {
    if (req.body.sender != null) {
        res.message.sender = req.body.sender
    }

    if (req.body.message != null) {
        res.message.message = req.body.message
    }
    try {
        const updatedMessage = await res.message.save()
        res.json(updatedMessage)
    } catch {
        res.status(400).json({ message: err.message })
    }
})

// Delete one message
router.delete('/:id', getMessage, async (req, res) => {
    try {
        await res.message.remove()
        res.json({ message: 'Deleted This Message' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getMessage(req, res, next) {
    try {
        message = await Message.findById(req.params.id)
        if (message == null) {
            return res.status(404).json({ message: 'Cant find message' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.message = message
    next()
}

module.exports = router;

/* Here for the origin example for this REST api : https://dev.to/beznet/build-a-rest-api-with-node-express-mongodb-4ho4 */