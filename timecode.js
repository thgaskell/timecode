(function() {
    (function init() {
        // Export the Timecode object for **Node.js**, with
        // backwards-compatibility for the old `require()` API. If we're in
        // the browser, add `Timecode` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode.
        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = Timecode;
            }
            exports.Timecode = Timecode;
        }
        else {
            this.Timecode = Timecode;
        }

        Timecode.prototype.toString = function() {
            var string = [this.hour, this.minute, this.second].map(function(value) {
                return ('0' + value).slice(-2) })
                .join(':');
            string += (this.dropframe) ? ';' : ':';
            return string + ('0' + this.frame).slice(-2);
        }

    })();

    /* Initial values */
    Timecode.fps = 30;
    Timecode.dropframe = false;
    Timecode.regex = /^(\d{2,}):(\d{2}):(\d{2})([:.;])(\d{2})$/;

    /* Supported framerates */
    Timecode.domain = {
        fps: [23.98, 24, 25, 29.97, 30]
    };

    Timecode.validate = function(timecode) {
        return Timecode.regex.test(timecode);
    };

    Timecode.config = function(obj) {
        if ( arguments.length > 0 && typeof obj === 'object' ){
            if ( obj.hasOwnProperty('fps') && Timecode.domain.fps.indexOf(obj.fps) > -1 ) {
                Timecode.fps = obj.fps;
            }
            if ( obj.hasOwnProperty('dropframe') ){
                Timecode.dropframe = obj.dropframe;
            }
        }
    };

    function Timecode() {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.frame = 0;
        this.fps = Timecode.fps;
        this.dropframe = Timecode.dropframe;

        switch ( arguments.length ) {
            case 3:
                if ( typeof arguments[2] === 'boolean'
                        && typeof arguments[0] === 'number' )
                {
                    this.dropframe = arguments[2];
                }
            case 2:
                if ( typeof arguments[1] === 'number' 
                        && Timecode.domain.fps.contains(arguments[1]) )
                {
                    this.fps = arguments[1];
                }
            case 1:
                if ( typeof arguments[0] === 'string' 
                     && Timecode.validate(arguments[0]) )
                {
                    var timecode = arguments[0].match(Timecode.regex);
                    this.hour = timecode[1];
                    this.minute = timecode[2];
                    this.second = timecode[3];
                    this.frame = timecode[5];
                    this.dropframe = (timecode[4] !== ':');
                }
                else if ( typeof arguments[0] === 'number' ) {
                    throw new RangeError("Currently unsupported.");
                }
                break;
            case 6:
                if ( typeof arguments[5] === 'boolean' ) {
                    this.dropframe = arguments[5];
                }
            case 5:
                if ( typeof arguments[4] === 'number' ) {
                    this.fps = arguments[4];
                }
            case 4:
                if ( Array.prototype.slice.call(arguments, 0,4).every(isNumber) ) {
                    this.hour = arguments[0];
                    this.minute = arguments[1];
                    this.second = arguments[2];
                    this.frame = arguments[3];
                }
                break;
            case 0:
            default:
                break;
        }

        function getFrame2997(frameNumber) {
            var times, hour, minute, second, frame, totalMinutes, frameNumber;

            times = timecode.split(/[:;]/).map(Number);

            hours = times[0];
            minutes = times[1];
            seconds = times[2];
            frames = times[3];

            totalMinutes = 60 * hours + minutes;
            frameNumber = 108000 * hours + 1800 * minutes + 30 * seconds + frames - 2 * (totalMinutes - Math.floor(totalMinutes / 10));

            return frameNumber;
        }

        function getTimecode2997(frameNumber) {
            var D, M, frameNumber, frames, seconds, minutes, hours;

            D = Math.floor(frameNumber / 17982);
            M = frameNumber % 17982;
            frameNumber += 18 * D + 2 * Math.floor((M - 2) / 1798);

            frames = frameNumber % 30;
            seconds = Math.floor(frameNumber / 30) % 60;
            minutes = Math.floor(Math.floor(frameNumber / 30) / 60) % 60;
            hours = Math.floor(Math.floor(Math.floor(frameNumber / 30) / 60) / 60) % 24;

            return hours + ":" + minutes + ":" + seconds + ";" + frames;
        }
    }

    return Timecode;

    function isNumber(arg) {
        return typeof arg === 'number'
    };
})();
