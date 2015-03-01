var expect = require('chai').expect;
var model = require('immodel').bootstrap({discriminators: require('../')});

describe('discriminators', function() {
  it('should work', function() {
    var User = model
      .attr('username', 'string')
      .attr('userType', 'string')
      .discriminator('userType', ['teacher', 'student'])
      .type('user');
    
    var Teacher = User
      .attr('subject', 'string')
      .type('teacher');
      
    var Student = User
      .attr('grade', 'number')
      .type('student');
    
    var doc = new User({userType: 'teacher'});
    
    expect(doc.get('username')).to.equal('');
    expect(doc.get('subject')).to.equal('');
    expect(doc.get('grade')).to.equal(undefined);
    
    doc = new User({});
    expect(doc.get('username')).to.equal('');
    expect(doc.get('subject')).to.equal(undefined);
    expect(doc.get('grade')).to.equal(undefined);
    
    doc = new User({userType: 'student'});
    expect(doc.get('username')).to.equal('');
    expect(doc.get('subject')).to.equal(undefined);
    expect(doc.get('grade')).to.equal(0);
  });
  
  it('should work on nested documents', function() {
    var Share = model
      .attr('object', 'object');
    
    var Obj = model
      .attr('content', 'string')
      .attr('objectType', 'string')
      .discriminator('objectType', ['question', 'video'])
      .type('object');
    
    var Question = Obj
      .attr('answer', 'string')
      .type('question');
    
    var Video = Obj
      .attr('url', 'string')
      .type('video');
      
    var doc = new Share({object: {}});
    
    expect(doc.get('object.content')).to.equal('');
    expect(doc.get('object.answer')).to.equal(undefined);
    expect(doc.get('object.url')).to.equal(undefined);
    
    doc = new Share({object: {objectType: 'question'}});

    expect(doc.get('object.content')).to.equal('');
    expect(doc.get('object.answer')).to.equal('');
    expect(doc.get('object.url')).to.equal(undefined);
    
    doc = new Share({object: {objectType: 'video'}});
    
    expect(doc.get('object.content')).to.equal('');
    expect(doc.get('object.answer')).to.equal(undefined);
    expect(doc.get('object.url')).to.equal(''); 
  });
});