module.exports =

(function() {

    var regex = /^(\d{2}):(\d{2}):(\d{2})([:;,])(\d{2})$/;

    Timecode.validate = function(timecode) {

        return regex.test(timecode);

    };

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
                    parseString.call(this, arguments[0], arguments[1]);
                    break;
                case 3:
                    parseFrame.call(this, arguments[0], arguments[1], arguments[2]);
                    break;
                case 6:
                    assign.apply(this, arguments);
                    break;
                default:
                    throw new Error();

            }

        }  
        else throw new TypeError();

        this.getFrame = function() {

            var totalMinutes;

            if (this.dropframe) {
                totalMinutes = 60 * this.hour + this.minute;
                return this.framerate * 3600 * this.hour + 
                    1800 * this.minute + 
                    30 * this.second +
                    this.frame - 
                    2 * (totalMinutes - Math.floor(totalMinutes / 10));
            }
            else {
                return this.hour * 3600 * this.framerate +
                this.minute * 60 * this.framerate +
                this.second * this.framerate +
                this.frame;
            }
        };

        this.to = function(framerate, dropframe) {

            return new Timecode(this.getFrame(), framerate, dropframe);

        };

        function valid(args) {

            return (
                (typeof args[0] === 'string' &&
                    Timecode.validate(args[0]) &&
                    typeof args[1] === 'number'
                ) ||
                ([].slice.call(args, 0, 5)
                    .every(function(value) {
                        return typeof value === 'number';
                    }) &&
                    typeof args[5] === 'boolean'
                ) ||
                (typeof args[0] === 'number' &&
                    typeof args[1] === 'number' &&
                    typeof args[2] === 'boolean')
            );

        }

        function parseString(timecode, framerate) {

            var results = regex.exec(timecode);

            assign.call(this, 
                results[1],
                results[2],
                results[3],
                results[5],
                framerate,
                (results[4] !== ':'));

        }

        function parseFrame(absoluteFrame, framerate, dropframe) {

            var partial, totalMinutes, droppedFrames;

            if (dropframe) {
                //remember to drop frames
                totalMinutes = ((absoluteFrame / framerate) / 60);
                droppedFrames = Math.floor(totalMinutes / 10) * 2;
                absoluteFrame += droppedFrames;
            }

            assign.call(this, 
                Math.floor(Math.floor(Math.floor(absoluteFrame / framerate) / 60) /60) % 24,
                Math.floor(Math.floor(absoluteFrame / framerate) / 60) % 60,
                Math.floor(absoluteFrame / framerate) % 60,
                Math.round(absoluteFrame % framerate),
                framerate,
                dropframe);

        }

        function assign(hour, minute, second, frame, framerate, dropframe) {

            this.hour = Number(hour);
            this.minute = Number(minute);
            this.second = Number(second);
            this.frame = Number(frame);
            this.framerate = framerate;
            this.dropframe = dropframe;

        }

    }

    return Timecode;

})();
