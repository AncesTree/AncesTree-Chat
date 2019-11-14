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
        name: req.body.name,
        pseudo: req.body.pseudo,
        roomsName: req.body.roomsName
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
    if (req.body.name != null) {
        res.user.name = req.body.name
    }

    if (req.body.pseudo != null) {
        res.user.pseudo = req.body.pseudo
    }

    if (req.body.roomsName != null) {
        res.user.roomsName = req.body.roomsName
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

/* Here for the origin example for this REST api : https://dev.to/beznet/build-a-rest-api-with-node-express-mongodb-4ho4 */