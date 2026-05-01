const express = require('express');
const router = express.Router();
const db = require('../ir/index_rerum.js');

function getUserById(userId) {
    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `).get(userId);

    if (!user) {
        return null;
    }

    return user;
}

function getUserByName(name) {
    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE name = ?
    `).get(name);

    if (!user) {
        return null;
    }

    return user;
}

router.get('/', (req, res) => {
    try {
        const users = db.prepare(`
            SELECT *
            FROM users
            ORDER BY id
        `).all();

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Not a number' });
    }

    try {
        const user = getUserById(id);

        if (!user) {
            return res.status(404).json({ error: 'Not a user' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/',(req, res) => {
    const name = String(req.body.name);
    if (!name) {
        return res.status(400).json({ error: 'Not a name' });
    }
    try {
        const user = getUserByName(name);
        if (user) {
            return res.status(200).json(user);
        }
        const result = db.prepare(`
            INSERT INTO users (name) VALUES (?);`)
            .run(name);
        const newUser = getUserById(result.lastInsertRowid);
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
})   ;

module.exports = router;