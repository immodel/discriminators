var assert = require('assert');
var model = require('immodel')
  .use(require('base', {discriminators: require('..')}));

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
    
    assert(doc.get('username') === '');
    assert(doc.get('subject') === '');
    assert(doc.get('grade') === undefined);
    
    doc = new User({});
    assert(doc.get('username') === '');
    assert(doc.get('subject') === undefined);
    assert(doc.get('grade') === undefined);
    
    doc = new User({userType: 'student'});
    assert(doc.get('username') === '');
    assert(doc.get('subject') === undefined);
    assert(doc.get('grade') === 0);
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

    assert(doc.get('object.content') === '');
    assert(doc.get('object.answer') === undefined);
    assert(doc.get('object.url') === undefined);    
    
    doc = new Share({object: {objectType: 'question'}});

    assert(doc.get('object.content') === '');
    assert(doc.get('object.answer') === '');
    assert(doc.get('object.url') === undefined);
    
    doc = new Share({object: {objectType: 'video'}});

    assert(doc.get('object.content') === '');
    assert(doc.get('object.answer') === undefined);
    assert(doc.get('object.url') === ''); 
  });
});