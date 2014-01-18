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

    describe('domain', function() {

        it('should contain a specific range of frame rates', function() {

            Timecode.domain.should
                .contain(30)
                .and.contain(29.97)
                .and.contain(24)
                .and.contain(23.98)
                .and.contain(23.976);

        });

    }); 

    describe('constructor', function() {

        var timecode;

        it('should accept timecode string and framerate', function() {

                timecode = new Timecode('01:02:03;04', 29.97);

                timecode.hour.should.equal(1);
                timecode.minute.should.equal(2);
                timecode.second.should.equal(3);
                timecode.frame.should.equal(4);
                timecode.framerate.should.equal(29.97);
                timecode.dropframe.should.equal(true);

        });

        it('should accept direct values', function() {
            
            timecode = new Timecode(1, 2, 3, 4, 29.97);
            timecode.hour.should.equal(1);
            timecode.minute.should.equal(2);
            timecode.second.should.equal(3);
            timecode.frame.should.equal(4);
            timecode.framerate.should.equal(29.97);
            timecode.dropframe.should.equal(true);

        });

        it('should accept absolute frame', function() {

            timecode = new Timecode(111694, 30);
            timecode.hour.should.equal(1);
            timecode.minute.should.equal(2);
            timecode.second.should.equal(3);
            timecode.frame.should.equal(4);
            timecode.framerate.should.equal(30);
            timecode.dropframe.should.equal(false);

            timecode = new Timecode(111582, 29.97);
            timecode.hour.should.equal(1);
            timecode.minute.should.equal(2);
            timecode.second.should.equal(3);
            timecode.frame.should.equal(4);
            timecode.framerate.should.equal(29.97);
            timecode.dropframe.should.equal(true);

        });

    });

    describe('#toString()', function() {

        var timecode;

        it('should return a valid timecode string', function() {

            timecode = new Timecode('01:02:03:04', 30);
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

        it('should convert between 30 to 29.97', function() {

            timecode = new Timecode('00:01:00:00', 30);

            timecode = timecode.to(29.97);
            timecode.hour.should.equal(0);
            timecode.minute.should.equal(1);
            timecode.second.should.equal(0);
            timecode.frame.should.equal(2);
            timecode.framerate.should.equal(29.97);
            timecode.dropframe.should.be.true;

            timecode = timecode.to(30);
            timecode.hour.should.equal(0);
            timecode.minute.should.equal(1);
            timecode.second.should.equal(0);
            timecode.frame.should.equal(0);
            timecode.framerate.should.equal(30);
            timecode.dropframe.should.be.false;

        });

        it('should convert between 23.97 and 29.98', function() {

            timecode = new Timecode('00:01:00:00', 23.98);

            timecode = timecode.to(29.97);
            timecode.hour.should.equal(0);
            timecode.minute.should.equal(0);
            timecode.second.should.equal(48);
            timecode.frame.should.equal(0);
            timecode.framerate.should.equal(29.97);
            timecode.dropframe.should.be.true;

            timecode = timecode.to(23.98);
            timecode.hour.should.equal(0);
            timecode.minute.should.equal(1);
            timecode.second.should.equal(0);
            timecode.frame.should.equal(0);
            timecode.framerate.should.equal(23.976);
            timecode.dropframe.should.be.false;

        });

        afterEach(function() {

            timecode = undefined;

        });

    });

    describe('#toMilliseconds()', function() {

        var timecode
        
        it('should return the timecode in milliseconds', function() {

            new Timecode('00:00:00:01', 29.97).toMilliseconds().should.equal(33);
            new Timecode('00:00:01:00', 29.97).toMilliseconds().should.equal(1000);
            new Timecode('00:00:01:15', 29.97).toMilliseconds().should.equal(1500);

        });
    });

});
