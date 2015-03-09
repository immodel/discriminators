var assert = require('assert');
var model = require('immodel')
  .use(require('immodel-base', {discriminators: require('..')}));

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

    assert(doc.get('username').value === '');
    assert(doc.get('subject').value === '');
    assert(doc.get('grade').value === undefined);

    doc = new User({});
    assert(doc.get('username').value === '');
    assert(doc.get('subject').value === undefined);
    assert(doc.get('grade').value === undefined);

    doc = new User({userType: 'student'});
    assert(doc.get('username').value === '');
    assert(doc.get('subject').value === undefined);
    assert(doc.get('grade').value === 0);
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

    assert(doc.get('object.content').value === '');
    assert(doc.get('object.answer').value === undefined);
    assert(doc.get('object.url').value === undefined);

    doc = new Share({object: {objectType: 'question'}});

    assert(doc.get('object.content').value === '');
    assert(doc.get('object.answer').value === '');
    assert(doc.get('object.url').value === undefined);

    doc = new Share({object: {objectType: 'video'}});

    assert(doc.get('object.content').value === '');
    assert(doc.get('object.answer').value === undefined);
    assert(doc.get('object.url').value === '');
  });
});