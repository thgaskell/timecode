(function() {
    (function init() {
        /* Export the Timecode object for **Node.js**, with
         * backwards-compatibility for the old `require()` API. If we're in
         * the browser, add `Timecode` as a global object via a string identifier,
         * for Closure Compiler "advanced" mode.
         */
        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = Timecode;
            }
            exports.Timecode = Timecode;
        }
        else {
            this.Timecode = Timecode;
        }

        //
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
    var regex = /^(\d{2}):(\d{2}):(\d{2})([:;])(\d{2})$/,

    /* Supported framerates */
        domain = {
            fps: [23.98, 24, 25, 29.97, 30]
        };

    /**
     * validate() returns boolean representing whether the input
     * is a well-fromed SMTPE timecode string
     *
     * @param <String> timecode
     * @return <Boolean> validated Whether the string matches the timecode regex pattern 
     */
    Timecode.validate = function(timecode) {
        return regex.test(timecode);
    };

    Timecode.config = function(obj) {
        if (arguments.length > 0 && typeof obj === 'object') {
            if (obj.hasOwnProperty('fps') &&
                    domain.fps.indexOf(obj.fps) > -1) {
                Timecode.fps = obj.fps;
            }
            if (obj.hasOwnProperty('dropframe')){
                Timecode.dropframe = obj.dropframe;
            }
        }
    };

    /**
     * SMTPE Timecode
     *
     * @class Timecode 
     * @constructor
     */
    function Timecode() {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.frame = 0;
        this.fps = Timecode.fps;
        this.dropframe = Timecode.dropframe;



        (function inputValidation(arguments) {
            var parsedValues;
            switch (arguments.length) {

                // "01:02:03:04", 30
                case 2: {
                    if (typeof arguments[0] == 'string' &&
                            typeof arguments[1] == 'number' &&
                            domain.fps.indexOf(arguments[1]) > -1) {
                        this.fps = arguments[1];
                    }
                    else throw new RangeError();
                }

                // "01:02:03:04" or "01:02:03;04"
                case 1:
                    if (typeof arguments[0] === 'string' &&
                            Timecode.validate(arguments[0])) {
                        parsedValues = arguments[0].split(/[:;]/);
                        parsedValues.every(function(value) {
                            return Number(value);
                        });
                        this.hour = parsedValues[0];
                        this.minute = parsedValues[1];
                        this.second = parsedValues[2];
                        this.frame = parsedValues[3];
                        this.dropframe = arguments[0].indexOf(";") > -1;
                    }
                    else throw new RangeError();
                    break;

                // 0, 1, 2, 3, 4, false
                case 5: 
                    if (typeof arguments[4] === 'boolean') {
                        this.dropframe = arguments[4];
                    }
                    else throw new RangeError();

                // 0, 1, 2, 3
                case 4:
                    var parameters = [].slice.call(arguments, 0, 4);
                    if (parameters.every(function(parameter) {
                            return typeof parameter === 'number';
                    })) {
                        parameters = parameters.map(function(parameter) {
                            return Math.floor(parameter);
                        });
                        this.hour = parameters[0];
                        this.minute = parameters[1];
                        this.second = parameters[2];
                        this.frame = parameters[3];
                    }
                    else throw new RangeError();
                    break;
                case 0: 
                    break;
                default:
                    throw new RangeError();
            }
        })(arguments);

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

})();
