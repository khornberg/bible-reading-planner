bible-reading-planner
=====================

Bible reading planner generates a list of verses to read each day.

A user supplies the sequence, reading amount, and duration of the reading plan.

## Releases

### 0.1.0 
Inital release. Download plan as a text or markdown file.

## TODO
- Minimize and concat bible.math.js
- Fonts, colors
	- Change primary, success, warning, info color of buttons and others
	- Customize bootstrap (get rid of what I don't use)
	- Google web fonts
- Scaffolding
	- Show create button only when data is selected
- Download
	- PDF
	- Markdown
- Share
	- Email
	- Social?
- Optimization
	- Load scripts from CDN?
	- cache.manifest
	- r.js?
	- CSS animations
- Privacy/legal statement in footer
- Plan
	- CONST for reading plans location
- Documentation

## Future

- i18n
- Offline access
- Mobile Apps (probably using Apache Cordova)
- Progress tracking

## Credits

### Bible reading plan sequences
Uses [devkardia's](https://github.com/devkardia/bibleplan/tree/master/readingplans) plans and created [json versions](https://github.com/khornberg/readingplans/) of the reading plans.

### For the Application
[bible.js](https://github.com/johndyer/bibly)
[Twitter Bootstrap](http://getbootstrap.com)
[Twix](http://icambron.github.io/twix.js/)
[Moment](http://momentjs.com)
[FileSaver](http://eligrey.com/blog/post/saving-generated-files-on-the-client-side)