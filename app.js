// app.js — Main server file

const express = require('express');
const { engine } = require('express-handlebars');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

const app = express();

// Handlebars as the view engine
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from ./public
app.use(express.static(path.join(__dirname, 'public')));

// GET /register render registration form
app.get('/register', (req, res) => {
    res.render('register');
});

// POST /register form submission
app.post('/register', (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send('Error parsing the form.');
        }

        // Validate: check if a file was uploaded
        if (!files.profilePic || files.profilePic.length === 0 || files.profilePic[0].size === 0) {
            return res.status(400).send('Please upload a profile picture.');
        }

        const uploadedFile = files.profilePic[0];

        // Validate: check if the file is an image
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(uploadedFile.headers['content-type'])) {
            return res.status(400).send('Only .jpg, .jpeg, and .png files are allowed.');
        }

        const oldPath = uploadedFile.path;
        const fileName = Date.now() + '-' + uploadedFile.originalFilename;
        const newPath = path.join(__dirname, 'public', 'uploads', fileName);

        // Move uploaded file from temp location to ./public/uploads
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                return res.status(500).send('Error saving the file.');
            }

            // Render profile.hbs with user data and image path
            res.render('profile', {
                name: fields.name[0],
                email: fields.email[0],
                course: fields.course[0],
                image: '/uploads/' + fileName
            });
        });
    });
});

// Start server on port 3000
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3000');
});
