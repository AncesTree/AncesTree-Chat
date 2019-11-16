const express = require("express");
const Room = require("./../models/Room");

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Get one room
router.get('/:id', getRoom, (req, res) => {
    res.json(res.room)
})

// Create one room
router.post('/', async (req, res) => {
    const room = new Room({
        name: req.body.name,
        users: req.body.users,
        messages: req.body.messages
    });
    try {
        const newRoom = await room.save();
        res.status(201).json(newRoom)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Update one room
router.patch('/:id', getRoom, async (req, res) => {
    if (req.body.name != null) {
        res.room.name = req.body.name
    }

    if (req.body.users != null) {
        res.room.users = req.body.users
    }

    if (req.body.messages != null) {
        res.room.messages = req.body.messages
    }
    try {
        const updatedRoom = await res.room.save()
        res.json(updatedRoom)
    } catch {
        res.status(400).json({ message: err.message })
    }
})

// Delete one room
router.delete('/:id', getRoom, async (req, res) => {
    try {
        await res.room.remove()
        res.json({ message: 'Deleted This Room' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get("/messages/:id", getRoom, async (req, res) => {
    try {
        await Room.findById(req.params.id).populate("rooms").populate("users").populate("sender").exec( (err, messages) => {
            res.json(messages)
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getRoom(req, res, next) {
    try {
        room = await Room.findById(req.params.id)
        if (room == null) {
            return res.status(404).json({ message: 'Cant find room' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.room = room
    next()
}

module.exports = router;