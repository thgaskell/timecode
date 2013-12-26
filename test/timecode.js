/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = chai.should();
    Timecode = require('../timecode.js');

chai.Assertion.includeStack = true;

describe('Timecode', function() {

    describe('#validate()', function() {

        it('should be parse timecode strings', function() {

            Timecode.validate('00:00:00:00').should.be.true;
            Timecode.validate('00:00:00;00').should.be.true;
            Timecode.validate('00:00:00,00').should.be.true;

        });
        
    });

    describe('constructor', function() {

        var timecode;

        it('should accept timecode string and framerate', function() {

                timecode = new Timecode('01:02:03:04', 30);

                timecode.hour.should.equal(1).and
                timecode.minute.should.equal(2).and
                timecode.second.should.equal(3).and
                timecode.frame.should.equal(4).and
                timecode.framerate.should.equal(30).and
                timecode.dropframe.should.equal(false);

        });

        it('should accept direct values', function() {
            
            timecode = new Timecode(1, 2, 3, 4, 30, false);

            timecode.hour.should.equal(1).and
            timecode.minute.should.equal(2).and
            timecode.second.should.equal(3).and
            timecode.frame.should.equal(4).and
            timecode.framerate.should.equal(30).and
            timecode.dropframe.should.equal(false);

        });

    });

describe('#toString()', function() {

    var timecode;

    it('should return a valid timecode string', function() {

        timecode = new Timecode('01:02:03:04', 30);
        timecode.toString().should.match(/01:02:03:04/);

        timecode = new Timecode('01:02:03;04', 30);
        timecode.toString().should.match(/01:02:03;04/);

    });

    after(function() {

        Timecode.dropDelimiter = ',';

    });
})

});
