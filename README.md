bible-reading-planner
=====================

Bible reading planner generates a list of verses to read.

A user supplies the sequence, length, and duration of the reading plan.

Very much a work in progress...

## Changes

## 29 October 2013
Scaffolding
CSS
Front-end js
Bootstrap buttons, tooltips not working

### 25 October 2013
Added Qunit tests to Grunt
Load bible.js, bible.reference.js and bible.math.js with RequireJS
Add bootstrap-datepicker to requirejs

### 23 October 2013
Put into a Yeoman workflow

### 21 October 2013
Moved bible.math.js into seperate repo

## TODO
- Minimize and concat bible.math.js?
- Calendars
	- Connect skip days to calendars
	- Get days between two dates (moment.js needed to exclude unwanted days?)
	- set up options
	- Bootstrap button groups not working
- Link list automatically loaded with json names in files?
	- Error handleing
- Plan section
	- Formats
	- Errors
- Fonts, colors
	- Primary color of buttons
	- Customize bootstrap (get rid of what I don't use)
- Scaffolding
	- Checkbox button group, radio button group not working


## Credits

### Bible reading plan sequences

Used [devkardia's](https://github.com/devkardia) plans and created json versions