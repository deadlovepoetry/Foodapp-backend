const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Replace with your actual secret stored securely
const jwtSecret = "MYNAMEISANAMITRAHAZRA";

router.post(
    '/createuser',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('name').isLength({ min: 4 }).withMessage('Name must be at least 4 characters long'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('location').not().isEmpty().withMessage('Location is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password, location } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            // Create a new user
            const newUser = new User({
                name,
                email,
                password: secPassword,
                location,
                date: new Date()
            });

            // Save the new user to the database
            await newUser.save();

            // Respond with success message
            res.json({ success: true });
        } catch (error) {
            // Log any errors and respond with a failure message
            console.error(error);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
);

router.post(
    '/loginuser',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            // Prepare payload for JWT
            const payload = {
                user: {
                    id: user.id
                }
            };

            // Generate JWT token
            const authToken = jwt.sign(payload, jwtSecret);

            // Respond with success message and token
            res.json({ success: true, authToken });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    }
);

module.exports = router;
