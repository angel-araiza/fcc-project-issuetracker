'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI, {useNewURLParser: true, useUnifiedTopology: true });

  const issueSchema = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: { type: String, required: true},
    created_on: {type: Date},
    updated_on: {type: Date},
    created_by: {type: String, required: true},
    assigned_to: {type: String},
    open: {type: Boolean},
    status_text: {type: String}
  });

  const Issue = mongoose.model('Issue', issueSchema); //the model defines what the database is called on MongoDB

  app.route('/api/issues/:project')
  
    .get(async (req, res) =>{
      let project = req.params.project;
      try{
        const issues = await Issue.find({});
        res.json({issues});
      } catch (err){
        res.json({error: "c"})
      }
    })
    
    .post(async (req, res) =>{
      let project = req.params.project;
      const title = req.body.issue_title;
      const text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;

      try {
        const newIssue = new Issue({title, text, created_by, assigned_to, status_text});
        await newIssue.save();
        res.json({_id: newIssue._id, issue_title: title, issue_text: text, created_by: created_by, assigned_to: assigned_to, status_text:status_text});

      } catch (error){
        res.json({error: error});
      }
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
