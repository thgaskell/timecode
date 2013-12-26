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

        if (valid(arguments)) {

            switch(arguments.length) {

                case 2:
                    parse.call(this, arguments[0]);
                    this.framerate = arguments[1];
                    break;

                case 6:
                    this.hour = arguments[0];
                    this.minute = arguments[1];
                    this.second = arguments[2];
                    this.frame = arguments[3];
                    this.framerate = arguments[4];
                    this.dropframe = arguments[5];
                    break;

                default:
                    throw new Error();

            }

        }
        else throw new TypeError();

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
                )
            );

        }

        function parse(timecode) {

            var results = regex.exec(timecode);
            this.hour = Number(results[1]);
            this.minute = Number(results[2]);
            this.second = Number(results[3]);
            this.frame = Number(results[5]);
            this.dropframe = (results[4] !== ':');

        }

    }

    return Timecode;

})();
