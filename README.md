bible-reading-planner
=====================

Bible reading planner generates a list of verses to read.

A user supplies the sequence, reading amount, and duration of the reading plan.

Very much a work in progress...

## Changes

## 30 October 2013
Buttons worked. Added bootstrap js file to require function
Single HTML for plan


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
- Plan section
	- Errors
- Fonts, colors
	- Change primary, success, warning, info color of buttons and others
	- Customize bootstrap (get rid of what I don't use)
	- Test Google web fonts
- Scaffolding
- Export
	- Text
	- PDF
	- Markdown
	- Email
	- Social?
- Optimization
	- Load scripts from CDN?
	- cache.manifest
- Plan
	refactor to include chapters
	generalize
	parse sequence item
	calc distance
	return object

bower install --save momentjs
bower install --save twix

## Credits

### Bible reading plan sequences
Used [devkardia's](https://github.com/devkardia) plans and created json versions

### Application
bible.js
Twitter Bootstrap