/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = chai.should();
    Timecode = require('../timecode.js');

chai.Assertion.includeStack = true

describe('Timecode', function() {

    describe('#config()', function() {

        it('it should have default values', function() {

            Timecode.fps.should.equal(30);
            Timecode.dropframe.should.be.false;

        });

        describe('validation', function() {

            it('should only change the configuration properties if valid values', function() {

                Timecode.config({fps: undefined, dropframe: undefined});
                Timecode.should.have.property('fps', 30);
                Timecode.should.have.property('dropframe', false);

            });

        });

    });

    describe('#constructor()', function() {

        describe('validation', function() {

            it('should accept timecode string', function() {

                new Timecode('00:00:00:00').should.exist;

            });

            it('should accept direct values', function() {

                new Timecode(0, 0, 0, 0).should.exist;

            });

            it('should allow user to override current Timecode configurations', function() {

                new Timecode('00:00:00:00', 30).should.exist;
                new Timecode(0, 0, 0, 0, false).should.exist;
                new Timecode(0, 0, 0, 0, false, 30).should.exist;

            });

            it('should validate framerate', function() {

                (function() {

                    new Timecode('00:00:00:00', 0);

                }).should.throw(RangeError);

            })

            it('should only accept a well-formed SMPTE timecode string', function() {

                (function() {

                    new Timecode('invalid');

                }).should.throw(RangeError);

            });

            it('should do type checking on input parameters', function() {

                (function() {

                    new Timecode(false);

                }).should.throw(RangeError);

                (function() {

                    new Timecode(30, '00:00:00:00');

                }).should.throw(RangeError);

                (function() {

                    new Timecode('0', '0', '0', '0');

                }).should.throw(RangeError);

            });

        });

        describe('instantiation', function() {

            var timecode;

            it('default values', function() {

                timecode = new Timecode();

                timecode.should.have.property('hour', 0);
                timecode.should.have.property('minute', 0);
                timecode.should.have.property('second', 0);
                timecode.should.have.property('frame', 0);
                timecode.should.have.property('fps', Timecode.fps);
                timecode.should.have.property('dropframe', Timecode.dropframe);

            })

            it('should assign the correct values', function() {

                timecode = new Timecode('01:02:03;04', 24);

                timecode.should.have.property('hour', 1);
                timecode.should.have.property('minute', 2);
                timecode.should.have.property('second', 3);
                timecode.should.have.property('frame', 4);
                timecode.should.have.property('fps', 24);
                timecode.should.have.property('dropframe', true);

            });

        });

    });

    describe('#validate()', function() {

        it('should validate strings as proper timecode format', function() {

            Timecode.validate('00:00:00:00').should.be.true; // Non-drop frame
            Timecode.validate('00:00:00;00').should.be.true; // Drop frame

        });

    });

    describe('instance', function() {

        describe('#getMilliseconds()', function() {

            it('should convert frames into milliseconds', function() {

                new Timecode('00:00:00:01', 30).getMilliseconds().should.equal(1000/30);
                new Timecode('00:00:00:01', 24).getMilliseconds().should.equal(1000/24);

            })

        });

        describe('#getFrame2997()', function() {

            before(function() {

                timecode = new Timecode('00:01:02;00');
            });

            it('should return the absolute frame number from dropframe', function() {

                timecode.hour.should.equal(0);
                timecode.minute.should.equal(0);
                timecode.second.should.equal(0);
                timecode.frame.should.equal(0);

            });

        })

        describe('non-drop frame', function(){

            Timecode.config({dropframe: false});
            var timecode = new Timecode();

            it('should match the format hh:mm:ss:ff', function() {

                Timecode.validate(timecode.toString()).should.be.true;
                timecode.toString().should.match(/^(\d){2}:(\d){2}:(\d){2}:(\d){2}$/);

            });

        });

        describe('drop frame',function() {

            Timecode.config({dropframe: true});
            var timecode = new Timecode();

            it('should match the format hh:mm:ss;ff', function() {

                Timecode.validate(timecode.toString()).should.be.true;
                timecode.toString().should.match(/^(\d){2}:(\d){2}:(\d){2};(\d){2}$/);

            });

        });


    });
});

// Tests execute out of order, so this will reset Timecode class configurations
beforeEach(function(){

    Timecode.reset();

});
