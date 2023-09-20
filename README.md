# to-do-list-ejs

This is a simple to-do list application built with Node.js and Express. It allows you to create and manage tasks in different lists.

## Features

- Add new items to the to-do list.
- Create separate lists for different categories (e.g., personal, work).
- Mark items as completed.
- Responsive design.

## Installation

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Start the application with `node app.js`.
4. Open your web browser and visit `http://localhost:3000`.

## Usage

- Home Page: The homepage displays the current date and the default to-do list for the day. You can add new tasks by entering them in the input field and clicking the "+" button. The tasks will appear below, and you can mark them as completed by checking the checkboxes.

- Work List: Access the work list by visiting http://localhost:3000/work. The work list allows you to add and manage tasks specific to work-related items. You can add new tasks, mark them as completed, and keep track of work-related to-do items separately.

## Customization

- To customize the lists or add more functionality, you can modify the code in `app.js`, `date.js`, and the EJS template file `list.ejs`.

## Dependencies

- Express
- Body-parser
- EJS

