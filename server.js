const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Rule = require('./models/ruleModel');


const app = express();
app.use(bodyParser.json());
app.use(cors())


mongoose.connect(`mongodb+srv://${process.env.EMAIL}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DATABASE}?retryWrites=true&w=majority&appName=Cluster0`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const validAttributes = ['age', 'department', 'salary', 'experience'];

class Node {
    constructor(type, value, left = null, right = null) {
        this.type = type; // 'operator' or 'operand'
        this.value = value; // The value of the node
        this.left = left; // Left child
        this.right = right; // Right child
    }
}

app.post('/create-rule', (req, res) => {
    const { name, rule_string } = req.body;

    try {
        // Extract attributes from the rule_string
        const attributes = rule_string.match(/\b(age|department|salary|experience)\b/g);

        // Check for invalid attributes
        attributes.forEach(element => {
            if (!validAttributes.includes(element)) {
                throw new Error(`Invalid attribute: ${element}`);
            }
        });

        // Create the AST from the rule string
        const ast = createRule(rule_string);

        // Save the rule to the database
        const rule = new Rule({ name, rule_string, ast });
        rule.save()
            .then(savedRule => res.json({ rule: savedRule }))
            .catch(err => {
                if (err.code === 11000) { // MongoDB duplicate key error code
                    res.status(400).json({ error: 'Rule name must be unique.' });
                } else {
                    res.status(500).json({ error: 'Error saving rule: ' + err.message });
                }
            });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

function createRule(rule_string) {
    try {
        // Tokenize the rule string
        const tokens = tokenize(rule_string);
        // Build the AST from the tokens
        return buildAST(tokens);
    } catch (error) {
        throw new Error('Error parsing rule string: ' + error.message);
    }
}

function tokenize(rule_string) {
    const regex = /\s*(=>|<=|>=|!=|==|AND|OR|\(|\)|\w+\s*[<>!=]*\s*'[^']*'|\w+\s*[<>!=]+\s*\w+|[<>]=?|=)\s*/g;
    return rule_string.split(regex).filter(token => token.length > 0);
}

function buildAST(tokens) {
    const output = [];
    const stack = [];
    const precedence = { 'OR': 1, 'AND': 2, '>': 3, '<': 3, '=': 3, '!=': 3, '>=': 3, '<=': 3 };


    tokens.forEach(token => {
        if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); // Remove the '(' from the stack
        } else if (precedence[token]) {
            while (stack.length && precedence[stack[stack.length - 1]] >= precedence[token]) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else {
            // Create a new operand node with the full condition
            output.push(new Node('operand', token)); // For conditions like 'age > 30'
        }
    });

    while (stack.length) {
        output.push(stack.pop());
    }

    return constructAST(output);
}

function constructAST(output) {
    const stack = [];

    output.forEach(item => {
        if (item instanceof Node) {
            stack.push(item);
        } else { // This is an operator
            const right = stack.pop();  // Pop right operand
            const left = stack.pop();   // Pop left operand
            stack.push(new Node('operator', item, left, right)); // Create a new operator node
        }
    });

    return stack[0]; // The root of the AST
}

app.post('/evaluate-rule', (req, res) => {
    const { ruleId, data } = req.body;

    Rule.findById(ruleId)
        .then(rule => {
            if (!rule) return res.status(404).json({ error: 'Rule not found' });

            try {
                const result = evaluateRule(rule.ast, data);
                res.json({ result });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

function evaluateRule(node, data) {
    if (!node || !data) throw new Error('Invalid node or data provided');

    if (node.type === 'operand') {
        // Split the value correctly
        const [key, operator, ...valueParts] = node.value.split(' ');
        const value = valueParts.join(' ').replace(/'/g, ""); // Remove single quotes from value

        if (!data.hasOwnProperty(key)) throw new Error(`Missing attribute in data: ${key}`);

        // Evaluate based on operator
        switch (operator) {
            case '>':
                return data[key] > Number(value);
            case '<':
                return data[key] < Number(value);
            case '=':
                return data[key] === value;
            case '>=':
                return data[key] >= Number(value);
            case '<=':
                return data[key] <= Number(value);
            case '!=':
                return data[key] != value;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    } else if (node.type === 'operator') {
        const leftEval = evaluateRule(node.left, data);
        const rightEval = evaluateRule(node.right, data);
        if (node.value === 'AND') return leftEval && rightEval;
        if (node.value === 'OR') return leftEval || rightEval;
    }
    return false; // Default return if nothing matches
}


// Function to combine rules into a single AST
function combineRules(rules) {
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
        throw new Error('Invalid rules input.');
    }

    // Create AST nodes for each rule
    const astNodes = rules.map(rule => createRule(rule));

    // Combine AST nodes with AND operator
    let combinedAST = astNodes.reduce((acc, curr) => {
        return new Node('operator', 'AND', acc, curr);
    });

    return combinedAST;
}

// Combine Rules Endpoint
app.post('/combine-rules', (req, res) => {
    const { name,rules } = req.body; // Extract rules from request body

    try {
        const combinedAST = combineRules(rules);
        const rule_string = rules.join(' AND ');
        const rule = new Rule({ name, rule_string, ast: combinedAST });
        rule.save()
            .then(savedRule => res.json({ rule: savedRule }))
            .catch(err => {
                if (err.code === 11000) { // MongoDB duplicate key error code
                    res.status(400).json({ error: 'Rule name must be unique.' });
                } else {
                    res.status(500).json({ error: 'Error saving rule: ' + err.message });
                }
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

// API to modify an existing rule
app.put('/modify-rule/:ruleId', (req, res) => {
    const ruleId = req.params.ruleId;
    const { updatedRuleString } = req.body;

    Rule.findById(ruleId).then(rule => {
        if (!rule) return res.status(404).json({ error: 'Rule not found' });

        // Validate and extract attributes from the updated rule string
        const attributes = updatedRuleString.match(/\b(age|department|salary|experience)\b/g);

        // Check for invalid attributes (ignore logical operators)
        const invalidAttributes = attributes.filter(element => !validAttributes.includes(element));
        if (invalidAttributes.length > 0) {
            return res.status(400).json({ error: `Invalid attribute(s): ${invalidAttributes.join(', ')}` });
        }

        // Create the updated AST from the updated rule string
        const UpdatedAST = createRule(updatedRuleString);

        // Update the rule in the database
        rule.rule_string = updatedRuleString;
        rule.ast = UpdatedAST;

        rule.save()
            .then(updatedRule => res.json({ message: 'Rule updated', rule: updatedRule }))
            .catch(err => res.status(500).json({ error: 'Error saving updated rule: ' + err.message }));
    }).catch(err => res.status(400).json({ error: err.message }));
});


// API to get all rules
app.get('/rules', (req, res) => {
    Rule.find().then(rules => res.json(rules)).catch(err => res.status(400).json({ error: err.message }));
  });

  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  });

  port = process.env.PORT || 3001
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
