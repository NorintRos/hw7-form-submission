# HW7 Form Submission

A small Express app with a registration form and image upload.

## Run

```bash
npm install
npm start
```

Open: `http://localhost:3001/register`

## Routes

- `GET /register` - shows the form
- `POST /register` - submits name, email, course, and `profilePic`

## Notes

- Uploaded files are renamed as: `<timestamp>-<originalFilename>`
- Files are moved into `public/uploads` and then served statically
- There is no database; data is displayed immediately after submit
- There is no `GET /` route, so open `/register` directly
