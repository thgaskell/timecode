/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = chai.should();
    Timecode = require('../timecode.js');

chai.Assertion.includeStack = true

describe('Timecode', function(){
    it('should validate strings as proper timecode format', function() {
        Timecode.validate('00:00:00:00').should.be.true; // Non-drop frame
        Timecode.validate('00:00:00;00').should.be.true; // Drop frame
    });

    describe('#constructor()', function() {
        it('should accept either 1 string or 4 integers', function() {
            new Timecode('00:00:00:00').should.exist;
            new Timecode(0, 0, 0, 0).should.exist;
        });
        it('should allow user to override current Timecode configurations', function() {
            new Timecode('00:00:00:00', 30).should.exist;
            new Timecode(0, 0, 0, 0, false).should.exist;
        });
        it('should only accept a well-formed SMPTE timecode string', function() {
            (function() {
                new Timecode("invalid");
            }).should.throw(RangeError);
        });
        it('should do type checking on input parameters', function() {
            (function() {
                new Timecode(false);
            }).should.throw(RangeError);
            (function() {
                new Timecode(30, "00:00:00:00");
            }).should.throw(RangeError);
            (function() {
                new Timecode("0", "0", "0", "0");
            }).should.throw(RangeError);
        });
    });
});

describe('Timecode instances', function() {
    describe('non-drop frame',function(){
        Timecode.config({dropframe: false});
        var timecode = new Timecode();
        it('should match the format hh:mm:ss:ff', function() {
            Timecode.validate(timecode.toString()).should.be.true;
            timecode.toString().should.match(/^(\d){2}:(\d){2}:(\d){2}:(\d){2}$/);
        });
    });

    describe('drop frame',function(){
        Timecode.config({dropframe: true});
        var timecode = new Timecode();
        it('should match the format hh:mm:ss;ff', function() {
            Timecode.validate(timecode.toString()).should.be.true;
            timecode.toString().should.match(/^(\d){2}:(\d){2}:(\d){2};(\d){2}$/);
        });
    });
});
