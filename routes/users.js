const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Get one user
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})

// Create one user
router.post('/', async (req, res) => {
    const user = new User({
        _id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        rooms: req.body.rooms
    });
    try {
        const newuser = await user.save();
        res.status(201).json(newuser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Update one user
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName
    }

    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName
    }

    if (req.body.rooms != null) {
        res.user.rooms = req.body.rooms
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch {
        res.status(400).json({ message: err.message })
    }
})

// Delete one user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ message: 'Deleted This User' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get("/rooms/:id", getUser, async (req, res) => {
    try {
        await User.findById(req.params.id).populate("rooms").exec( (err, rooms) => {
            res.json(rooms)
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cant find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}

module.exports = router;