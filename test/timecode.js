/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = chai.should();
    Timecode = require('../timecode.js');

describe('Timecode', function(){
    it('should be a function', function(){
        Timecode.should.be.a('function');
    });
});

describe('Timecode instances', function() {
    it('should not be an empty object', function(){
        Object.keys(new Timecode()).length.should.be.above(0);
    });

    describe('non-drop frame',function(){
        Timecode.config({dropframe: false});
        var timecode = new Timecode();
        it('should match the format hh:mm:ss:ff', function() {
            timecode.toString().should.match(/\d{2,}:\d{2}:\d{2}:\d{2}/);
        });
    });

    describe('drop frame',function(){
        Timecode.config({dropframe: true});
        var timecode = new Timecode();
        it('should match the format hh:mm:ss;ff', function() {
            timecode.toString().should.match(/\d{2,}:\d{2}:\d{2};\d{2}/);
        });
    });
});