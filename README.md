# Timecode
**Version: 0.0.1**

Library for creating and converting SMPTE timecode objects.

---

Timecode allows you to easily convert between timecodes of different framerates.

# Usage

```javascript
new Timecode('01:02:03;04' 29.97);
new Timecode(1, 2, 3, 4 29.97 true);
new Timecode(111694, 29.97, true);
```

# Reference

##`Timecode.validate(string)`

### Description

Checks if the provided string matches the SMPTE timecode format.


### Parameters
  - `string` – an SMPTE formated string. Must match one of the following formats:
    - `HH:MM:SS:FF`
    - `HH:MM:SS;FF`
    - `HH:MM:SS.FF`

### Returns: `boolean`

##`toString()`

### Description

Returns the timecode object as a string

### Returns: `string`

## `getFrame()`

### Description

Returns the absolute frame number that the timecode represents.

### Returns: `number`

## `to(framerate, dropframe)`

Converts the timecode to another framerate and dropframe.

### Parameters
  - `framerate` – a number representing the target framerate.
  - `dropframe` – a boolean representing whether the target timecode should have dropframes or not.
  
### Returns: `Timecode object`