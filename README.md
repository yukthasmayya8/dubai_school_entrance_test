# Dubai Indian School – Math Adventure Test

A playful, child-friendly web application designed for a primary school admission assessment. The app presents three short arithmetic questions in a bright, interactive interface and rewards successful completion with a celebratory result screen.

## Overview

This project is a front-end admission quiz for young learners. It includes:

- A welcoming start screen
- Three randomized arithmetic questions
- Addition, subtraction, and multiplication problems
- A touch-friendly on-screen number keypad
- Keyboard support for quick input
- Progress tracking and final pass/fail states
- A confetti celebration screen for successful completion
- Responsive styling for desktop and mobile devices

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure

- `index.html` – Page structure and content
- `styles.css` – Visual design and responsive layout
- `app.js` – Quiz logic, answer validation, and user interactions

## How to Run

You can run the app in either of these ways:

1. Open `index.html` directly in a browser.
2. Or serve the project locally:

   ```bash
   cd /workspaces/dubai_school_entrance_test
   python3 -m http.server 8000
   ```

Then visit:

```text
http://localhost:8000
```

## How It Works

1. Click the Start Adventure button.
2. Solve each displayed math question.
3. Enter your answer using the keypad or keyboard.
4. Press Submit Answer to move to the next question.
5. Complete all three questions to win the admission test.

## Notes

- Questions are generated randomly for each session.
- The app is fully client-side and does not require a backend.
- It is designed for a simple, kid-friendly admission experience and is suitable for demonstration or classroom use.

## License

This project is intended for educational and demonstration purposes.
