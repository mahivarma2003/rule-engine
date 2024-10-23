const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true
        },
        rule_string:{
            type: String,
            required: true
        },
        ast:{
            type: Object,
            required: true
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('Rule', ruleSchema);