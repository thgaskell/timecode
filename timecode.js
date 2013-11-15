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
    })();

    /* Initial values */
    Timecode.fps = 30;
    Timecode.dropframe = false;
    Timecode.regex = /^(\d{2}):(\d{2}):(\d{2})([:.;])(\d{2})$/;

    /* Supported framerates */
    Timecode.domain = {
        fps: [23.98, 24, 25, 29.97, 30]
    };

    Timecode.validate = function(timecode) {
        return Timecode.regex.test(timecode);
    };

    Timecode.config = function(obj) {
        if ( arguments.length > 0 && typeof obj === 'object' ){
            if ( obj.hasOwnProperty('fps') && Timecode.domain.fps.indexOf(obj['fps']) > -1 ) {
                Timecode.fps = obj['fps'];
            }
            if ( obj.hasOwnProperty('dropframe') ){
                Timecode.dropframe = obj['dropframe'];
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
                    var timecode = Timecode.regex.match(arguments[0]);
                    this.hour = timecode[1];
                    this.minute = timecode[2];
                    this.second = timecode[3];
                    this.frame = timecode[5];
                    this.dropframe = (timecode[4] !== ':');
                }
                else if ( typeof arguments[0] === 'number' ) {
                    // TODO: this.parseFrame(arguments(0));
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
                var isNumber = function(arg) { return typeof arg === 'number' };
                if ( Array.prototype.slice.call(arguments, 0,4).
                        every(function(arg) { return typeof arg === 'number' }) ) {
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
    }

    return Timecode;
})();
