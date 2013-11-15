# Timecode

Library for creating and manipulating SMPTE timecode objects.

---

Timecode allows you to easily convert between timecodes of different framerates.

## API Reference

### Constructor
Calling the constructor with no parameters will result in a new timecode object initialized to the first frame 

```javascript
var tc = new Timecode();
```

```javascript
var tc = new Timecode("01:02:03;04" [,framerate]);
```

```javascript
var tc = new Timecode(111694 [,framerate] [,dropframe]);
```

```javascript
Timecode(hour, minute, second, frame [,framerate] [,dropframe]);
```