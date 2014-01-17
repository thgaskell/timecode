module.exports =

(function() {

    var regex = /^(\d{2}):(\d{2}):(\d{2})([:;,])(\d{2})$/;

    Timecode.validate = function(timecode) {

        return regex.test(timecode);

    };

    Timecode.domain = [23.976, 23.98, 24, 29.97, 30];

    Timecode.prototype.toString = function() {

        var times = [this.hour, this.minute, this.second, this.frame]
            .map(function(number, index) {
                return ('0' + number).slice(-2);
            });

        return times.slice(0, 3).join(':') +
            (this.dropframe ? ';' : ':') +
            times[3];
            
    };

    function Timecode() {

        var values;

        if (valid(arguments)) {
            switch(arguments.length) {

                case 2:
                    if (typeof arguments[0] === 'string')
                        parseString.call(this, arguments[0], arguments[1]);
                    else if (typeof arguments[0] === 'number')
                        parseFrame.call(this, arguments[0], arguments[1]);
                    else
                        throw new Error('First parameter must either be a string or a number');
                    break;
                case 5:
                    assign.apply(this, arguments);
                    break;
                default:
                    throw new Error();

            }

        }  
        else throw new TypeError();

        this.getFrame = function() {

            var totalMinutes,
                framerate = Math.round(this.framerate);

            if (this.dropframe) {
                totalMinutes = 60 * this.hour + this.minute;
                return framerate * 3600 * this.hour + 
                    1800 * this.minute + 
                    30 * this.second +
                    this.frame - 
                    2 * (totalMinutes - Math.floor(totalMinutes / 10));
            }
            else {
                return this.hour * 3600 * framerate +
                this.minute * 60 * framerate +
                this.second * framerate +
                this.frame;
            }
        };

        this.to = function(framerate, dropframe) {

            return new Timecode(this.getFrame(), framerate);

        };

        function valid(args) {

            return (
                (typeof args[0] === 'string' &&
                    Timecode.validate(args[0]) &&
                    typeof args[1] === 'number'
                ) ||
                (typeof args[0] === 'number' &&
                    typeof args[1] === 'number'
                ) ||
                ([].slice.call(args, 0, 4)
                    .every(function(value) {
                        return typeof value === 'number';
                    })
                )
            );

        }

        function parseString(timecode, framerate) {

            var results = regex.exec(timecode);

            assign.call(this, 
                results[1],
                results[2],
                results[3],
                results[5],
                framerate
            );

        }

        function parseFrame(absoluteFrame, framerate) {

            var D, M, totalMinutes, droppedFrames,
                roundFramerate = Math.round(framerate);

            if (framerate === 29.97) {

                // The number of 10 minute inteverals
                D = Math.floor(absoluteFrame / ((600 * roundFramerate) - 18));

                // The remaining minutes
                M = absoluteFrame % ((600 * roundFramerate) - 18);

                // Add 18 frames for every 10 minutes, and 2 frames for every remaining minute
                absoluteFrame += 18 * D + 2 * Math.floor((M - 2) / (60 * roundFramerate - 2));

            }

            assign.call(this, 
                Math.floor(Math.floor(Math.floor(absoluteFrame / roundFramerate) / 60) / 60) % 24,
                Math.floor(Math.floor(absoluteFrame / roundFramerate) / 60) % 60,
                Math.floor(absoluteFrame / roundFramerate) % 60,
                absoluteFrame % roundFramerate,
                framerate);

        }

        function assign(hour, minute, second, frame, framerate) {

            this.hour = Number(hour);
            this.minute = Number(minute);
            this.second = Number(second);
            this.frame = Number(frame);
            this.framerate = framerate;
            this.dropframe = (framerate === 29.97);

        }

    }

    return Timecode;

})();
