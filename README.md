# rule-engine
# Rule Engine with Abstract Syntax Tree (AST)

## Project Overview
This project is a simple 3-tier rule engine application designed to determine user eligibility based on attributes such as age, department, income, and spend. The system represents conditional rules using an Abstract Syntax Tree (AST) and supports the dynamic creation, combination, and evaluation of rules.

## Features
- **Rule Creation**: Create individual rules that can represent conditions like age, department, and income using an AST structure.
- **Rule Combination**: Combine multiple rules into a single AST for more complex evaluations.
- **Rule Evaluation**: Evaluate rules against user data to determine eligibility.
- **Dynamic Rule Modification**: Allows modification of existing rules, including operators and conditions.
- **Error Handling**: Validates rule strings and input data to ensure correct processing.

## Technologies Used
- **Backend**: Node.js for rule engine processing.
- **Database**: MongoDB for storing rules and application metadata.
- **Frontend**: HTML, CSS, JavaScript for UI to create, view, and modify rules.
- **Others**: Docker for containerization.

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
