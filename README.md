#Rule Engine - README
#Overview
This Rule Engine application allows users to create, modify, evaluate, and combine custom rules based on user attributes such as age, department, salary, and experience. The rule system uses Abstract Syntax Trees (AST) to represent and evaluate logical expressions.

This document provides a comprehensive guide on how to set up, run, and interact with the application, including the backend server built using Node.js and MongoDB, and the frontend built with HTML, CSS (Bootstrap), and JavaScript.

##Features
Create Rules: Define rules using attributes and logical operators.
Evaluate Rules: Apply rules to user data to determine eligibility.
Modify Rules: Update existing rules and their logic.
Combine Rules: Merge multiple rules into a single AST with logical operators.
Real-Time Rule Evaluation: Rules are evaluated dynamically based on inputs.
##Application Design
###Backend:
Node.js: Provides RESTful API endpoints to manage and evaluate rules.
MongoDB: Stores rule data, including the rule string and its AST.
Abstract Syntax Tree (AST): Used for parsing and evaluating rule strings.
Mongoose: MongoDB ORM for schema-based data management.
###Frontend:
HTML/CSS/Bootstrap: User interface for interacting with the rule engine.
JavaScript: Handles form submissions and interactions with the backend API.
Dependencies
Backend:
Node.js: Backend runtime environment.
Express.js: Web framework for handling routes and requests.
MongoDB: Database used for storing rules.
Mongoose: MongoDB ORM for data schema and validation.
Cors: Middleware for Cross-Origin Resource Sharing.
Body-parser: Middleware to parse incoming request bodies in a middleware before your handlers.
Dotenv: For environment variable management.
Frontend:
Bootstrap: UI styling and responsive design.
JavaScript: Logic for managing interactions with backend API.
###Prerequisites
Node.js: Version 14 or later.
MongoDB: A MongoDB instance of running locally

## Data Structure

### Abstract Syntax Tree (AST)
The AST is used to represent rules dynamically. Each rule is stored as a tree of nodes where:
- **type**: Indicates whether the node is an "operator" (AND/OR) or an "operand" (condition).
- **left**: Points to the left child node.
- **right**: Points to the right child node.
- **value**: Holds the condition or comparison value for operand nodes.

Example Node Structure:
```json
{
  "type": "operator",
  "operator": "AND",
  "left": {
    "type": "operand",
    "attribute": "age",
    "comparison": ">",
    "value": 30
  },
  "right": {
    "type": "operand",
    "attribute": "department",
    "comparison": "=",
    "value": "Sales"
  }
}
