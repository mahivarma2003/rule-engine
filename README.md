#Rule Engine Application


This Rule Engine application allows users to create, evaluate, modify, and combine dynamic rules based on various attributes like age, department, salary, and experience. The application is built using Node.js, Express, and MongoDB for the backend, and a frontend powered by HTML, CSS, JavaScript, and Bootstrap.

Table of Contents
Features
Technologies Used
Prerequisites
Setup and Installation
Environment Variables
API Endpoints
Usage
Docker Instructions
Design Choices
Features
Create Rules: Define rules using attributes like age, department, salary, etc., and save them in the database.
Evaluate Rules: Evaluate a rule using user-provided data (attributes) to see if the conditions hold.
Modify Rules: Update existing rules in the database.
Combine Rules: Combine multiple rules using the AND operator.
View All Rules: Retrieve all the existing rules in the system.
Technologies Used
Frontend: HTML, CSS, JavaScript, Bootstrap
Backend: Node.js, Express
Database: MongoDB
AST Parsing: Custom-built AST parser for rule processing
Prerequisites
Node.js: Make sure Node.js is installed on your machine. You can download it from here.
MongoDB: MongoDB should be installed or accessible as a cloud instance (e.g., MongoDB Atlas).
Docker (Optional): If you want to run the services inside containers, Docker is required.
Setup and Installation
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/rule-engine-app.git
cd rule-engine-app
2. Install Dependencies
bash
Copy code
npm install
3. Set Up MongoDB
You can either use a local instance of MongoDB or set up a free cloud-based MongoDB database using MongoDB Atlas.

If you're using a local MongoDB instance, ensure that MongoDB is installed and running.
For a cloud-based MongoDB instance, sign up on MongoDB Atlas and create a new database.
4. Set Up Environment Variables
Create a .env file in the root of your project and add the following:

bash
Copy code
EMAIL=your_email_for_mongodb
PASSWORD=your_mongodb_password
HOST=your_mongodb_cluster_host
DATABASE=your_database_name
PORT=3001 # or any port you'd prefer
5. Run the Application
bash
Copy code
npm start
The server will run at http://localhost:3001.

Environment Variables
Ensure you configure the following environment variables in your .env file:

EMAIL: MongoDB Atlas cluster user email.
PASSWORD: Password for MongoDB Atlas cluster.
HOST: Host for MongoDB cluster (e.g., cluster0.mongodb.net).
DATABASE: MongoDB database name.
PORT: Port where the server will run.
API Endpoints
1. Create a Rule
POST /create-rule
Request Body:
json
Copy code
{
  "name": "Rule Name",
  "rule_string": "age > 30 AND department = 'Sales'"
}
Response:
json
Copy code
{
  "rule": {
    "_id": "rule_id",
    "name": "Rule Name",
    "rule_string": "age > 30 AND department = 'Sales'",
    "ast": { ... },
    "createdAt": "2024-10-23T...",
    "updatedAt": "2024-10-23T..."
  }
}
2. Evaluate a Rule
POST /evaluate-rule
Request Body:
json
Copy code
{
  "ruleId": "rule_id",
  "data": {
    "age": 35,
    "department": "Sales",
    "salary": 50000,
    "experience": 5
  }
}
Response:
json
Copy code
{
  "result": true
}
3. Modify a Rule
PUT /modify-rule/:ruleId
Request Body:
json
Copy code
{
  "updatedRuleString": "age > 40 AND department = 'Marketing'"
}
4. Combine Rules
POST /combine-rules
Request Body:
json
Copy code
{
  "name": "Combined Rule",
  "rules": [
    "age > 30 AND department = 'Sales'",
    "salary > 50000"
  ]
}
5. Get All Rules
GET /rules
Response:
json
Copy code
[
  {
    "_id": "rule_id",
    "name": "Rule Name",
    "rule_string": "age > 30 AND department = 'Sales'",
    "ast": { ... },
    "createdAt": "2024-10-23T...",
    "updatedAt": "2024-10-23T..."
  },
  ...
]
Usage
Frontend Interface
Open your browser and navigate to http://localhost:3001/index.html.
Use the interface to:
Create rules using the "Create Rule" form.
Evaluate rules by selecting a rule and providing attribute data.
Modify existing rules.
Combine multiple rules into one.
