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

                timecode = new Timecode('01:02:03:04', 29.97);

                timecode.hour.should.equal(1).and
                timecode.minute.should.equal(2).and
                timecode.second.should.equal(3).and
                timecode.frame.should.equal(4).and
                timecode.framerate.should.equal(29.97).and
                timecode.dropframe.should.equal(false);

        });

        it('should accept direct values', function() {
            
            timecode = new Timecode(1, 2, 3, 4, 29.97, false);
            timecode.hour.should.equal(1).and
            timecode.minute.should.equal(2).and
            timecode.second.should.equal(3).and
            timecode.frame.should.equal(4).and
            timecode.framerate.should.equal(29.97).and
            timecode.dropframe.should.equal(false);

        });

        it('should accept absolute frame', function() {

            timecode = new Timecode(111694, 29.97, false);
            timecode.hour.should.equal(1).and
            timecode.minute.should.equal(2).and
            timecode.second.should.equal(3).and
            timecode.frame.should.equal(4).and
            timecode.framerate.should.equal(29.97).and
            timecode.dropframe.should.equal(false);

            timecode = new Timecode(111582, 29.97, true);
            timecode.hour.should.equal(1).and
            timecode.minute.should.equal(2).and
            timecode.second.should.equal(3).and
            timecode.frame.should.equal(4).and
            timecode.framerate.should.equal(29.97).and
            timecode.dropframe.should.equal(true);

        });

    });

    describe('#toString()', function() {

        var timecode;

        it('should return a valid timecode string', function() {

            timecode = new Timecode('01:02:03:04', 29.97);
            timecode.toString().should.match(/01:02:03:04/);

            timecode = new Timecode('01:02:03;04', 29.97);
            timecode.toString().should.match(/01:02:03;04/);

        });

        after(function() {

            Timecode.dropDelimiter = ',';

        });
    })

    describe('#getFrame()', function() {

        var timecode;

        it('should return the absolute frame number', function() {

            timecode = new Timecode('00:01:00:00', 30);
            timecode.getFrame().should.equal(1800);

            timecode = new Timecode('00:01:00;02', 29.97);
            timecode.getFrame().should.equal(1800);
        })

    });

    describe('#to()', function() {

        var timecode;

        beforeEach(function() {

            timecode = new Timecode('00:01:00:00', 30);

        });

        it('should convert the timecode to another format', function() {

            timecode = timecode.to(29.97, true);
            timecode.hour.should.equal(0);
            timecode.minute.should.equal(1);
            timecode.second.should.equal(0);
            timecode.frame.should.equal(2);
            timecode.framerate.should.equal(29.97);
            timecode.dropframe.should.be.true;

        });

        afterEach(function() {

            timecode = undefined;

        });

    });

});
