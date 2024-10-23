# Rule Engine Application

This project is a rule engine that allows users to create, modify, evaluate, and combine rules using an Abstract Syntax Tree (AST). The rules are stored in a MongoDB database and can be dynamically evaluated based on user inputs such as age, department, salary, and experience. The system supports complex rule combinations using logical operators like `AND`, `OR`, and comparisons such as `>`, `<`, `=`, `!=`, etc.

## Features

- Create rules dynamically based on user input.
- Evaluate rules by passing user attributes such as age, department, salary, and experience.
- Modify existing rules.
- Combine multiple rules into a single rule with an AST representation.
- All rules are stored in a MongoDB database.
- Frontend interface to interact with the rule engine.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Environment Variables**: `dotenv` for managing sensitive configuration like database credentials

## Dependencies

### Backend Dependencies

- **Node.js**: Ensure Node.js is installed.
- **Express.js**: Web framework for Node.js.
- **Mongoose**: For MongoDB object modeling.
- **dotenv**: To manage environment variables.
- **body-parser**: Middleware to handle JSON request bodies.
- **cors**: Middleware to enable Cross-Origin Resource Sharing.

### Frontend Dependencies

- **Bootstrap**: A CSS framework to design the UI.
- **JavaScript**: For client-side interactivity.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rule-engine.git
cd rule-engine


2. Install dependencies
Make sure you have Node.js and MongoDB installed. Then, run the following command:

bash
Copy code
npm install
3. Configure environment variables
Create a .env file in the project root and add the following environment variables:

makefile
Copy code
EMAIL=<your-mongodb-username>
PASSWORD=<your-mongodb-password>
HOST=<your-mongodb-host>
DATABASE=<your-database-name>
PORT=3001
4. Start MongoDB
If MongoDB is not installed locally, you can set it up using Docker. Run the following command to start a MongoDB container:

bash
Copy code
docker run --name rule-engine-mongo -p 27017:27017 -d mongo
5. Start the server
Once MongoDB is up, start the Node.js server:

bash
Copy code
npm start
The server will be running on http://localhost:3001.

6. Access the Application
Open index.html in your browser to access the frontend.

API Endpoints
1. Create Rule
POST /create-rule

Request Body:

json
Copy code
{
  "name": "Rule1",
  "rule_string": "age > 30 AND department = 'Sales'"
}
2. Evaluate Rule
POST /evaluate-rule

Request Body:

json
Copy code
{
  "ruleId": "605c2f8f49adf61060b1b5b2",
  "data": {
    "age": 32,
    "department": "Sales",
    "salary": 50000,
    "experience": 5
  }
}
3. Modify Rule
PUT /modify-rule/:ruleId

Request Body:

json
Copy code
{
  "updatedRuleString": "age > 35 AND department = 'HR'"
}
4. Combine Rules
POST /combine-rules

Request Body:

json
Copy code
{
  "name": "CombinedRule1",
  "rules": [
    "age > 30 AND department = 'Sales'",
    "salary >= 50000"
  ]
}
5. Get All Rules
GET /rules

Response:

json
Copy code
[
  {
    "_id": "605c2f8f49adf61060b1b5b2",
    "name": "Rule1",
    "rule_string": "age > 30 AND department = 'Sales'",
    "ast": {...}
  }
]
