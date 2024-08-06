'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI);

  const issueSchema = new mongoose.Schema({
    project: {type: String, required :true},
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
        const issues = await Issue.find({project: project});
        res.json(issues); 
      } catch (err){
        res.json({error: "can't find issues"})
      }
    })
    
    .post(async (req, res) =>{
      let project = req.params.project;
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
      
      if (!issue_title || !issue_text || !created_by){
        return res.status(400).json({ error: "required field(s) missing"});
      };

      try {
        const newIssue = new Issue({
          project,
          issue_title, 
          issue_text, 
          created_by,
          assigned_to, 
          status_text,
          open: true,
          created_on: new Date(),
          updated_on: new Date()
        });
        await newIssue.save();
        console.log("got it");
        res.json({
          _id: newIssue._id,
          issue_title: newIssue.issue_title, 
          issue_text: newIssue.issue_text,
          created_by: newIssue.created_by, 
          assigned_to: newIssue.assigned_to, 
          status_text: newIssue.status_text,
          open: newIssue.open,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
        });

      } catch (error){
        res.status(400).json({error: "There was an error saving the issue"});
      }
      
    })
    
    .put(async (req, res) =>{
      let project = req.params.project;
      const { _id, issue_title, issue_text,  created_by, assigned_to, status_text, open} = req.body
      //const updates = {issue_title, issue_text, created_by, assigned_to, status_text, open};

      if(!_id){
        return res.status(400).json({ error: "missing _id"})
      };

      const updates = {}
      if (issue_title !== undefined) updates.issue_title = issue_title;
      if (issue_text !== undefined) updates.issue_text = issue_text;
      if (created_by !== undefined) updates.created_by = created_by;
      if (assigned_to !== undefined) updates.assigned_to = assigned_to;
      if (status_text !== undefined) updates.status_text = status_text;
      if (open !== undefined) updates.open = open;
      if (updates) updates.updated_on = new Date();
      console.log(updates);
      try{
        const doc = await Issue.findOneAndUpdate( {_id, project}, updates, {new: true});
        if (!doc){
          return res.status(404).json({ error: "No issue with that _id found."})
        };
        console.log(doc);
        res.json({doc})
      } catch (err){
        res.status(400).json({error: "unable to update issue."})
      }
    })
    
    .delete( async (req, res) =>{
      let project = req.params.project;
      const _id = req.body._id;
      
      try{
        await Issue.deleteOne({_id:_id});
      } catch (err){
        res.status(400).json({error: "unable to delete issue."})
      }
    });
    
};

