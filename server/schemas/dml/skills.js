var rfr = require('rfr'),
mongoose = require('mongoose'),
skills = mongoose.model('skills');

var skillModel = rfr('/server/models/static/skills');

skills.count().exec(function(err, res) {
  if (res === 0) {
    skills.insertMany([
      {'name': 'Legal Research'},
      {'name': 'Legal Writing'},
      {'name': 'Legal Advice'},
      {'name': 'Legal Assistance'},
      {'name': 'Legal Document Preparation'},
      {'name': 'Legal Compliance'},
      {'name': 'Legal Translation'},
      {'name': 'Legal Opinions'},
      {'name': 'Contract Review'},
      {'name': 'Litigation'},
      {'name': 'Class Action Certification and Notice'},
      {'name': 'Court Mediated Conferences'},
      {'name': 'Preliminary Injunctions'},
      {'name': 'Provisional Remedies'},
      {'name': 'Discovery'},
      {'name': 'Depositions'},
      {'name': 'Discovery Motions'},
      {'name': 'Document Production'},
      {'name': 'Motion'},
      {'name': 'Trial Preparation'},
      {'name': 'Expert Witnesses'},
      {'name': 'Fact Witnesses'},
      {'name': 'Post-Trial Motions'},
      {'name': 'Motions'},
      {'name': 'Trial Attendance'},
      {'name': 'Hearing Attendance'},
      {'name': 'Appellate Briefs'},
      {'name': 'Appellate Motions'},
      {'name': 'Appellate Submissions'},
      {'name': 'Oral Argument'},
      {'name': 'Proposal Drafting'},
      {'name': 'Term Sheet Drafting'},
      {'name': 'Contracts'},
      {'name': 'Contracts Drafting'},
      {'name': 'Transaction Document Drafting'},
      {'name': 'Due Diligence'},
      {'name': 'Closing Document Drafting'},
      {'name': 'Real Estate Closings'},
      {'name': 'Post-Closing Document Drafting'},
      {'name': 'Bankruptcy'},
      {'name': 'Bankruptcy Case Administration'},
      {'name': 'Meetings with Creditors'},
      {'name': 'Receiverships'},
      {'name': 'Special Masterships'},
      {'name': 'Bankruptcy Claims Administration'},
      {'name': 'Bankruptcy Objections'},
      {'name': 'Asset Analysis and Recovery'},
      {'name': 'Bankruptcy Motions'},
      {'name': 'Bankruptcy Proceedings'},
      {'name': 'Restructurings'},
      {'name': 'Mediations'},
      {'name': 'Arbitrations'},
      {'name': 'Administrative Hearings'},
      {'name': 'Other'}
    ], function(err, res) {
      skillModel.get();
    });
  } else {
    skillModel.get();
  }
});
