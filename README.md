bible-reading-planner
=====================

Bible reading planner generates a list of verses to read each day.

A user supplies the sequence, reading amount, and duration of the reading plan.

## Releases

### 0.1.0 
Inital release.

## TODO
- Fonts, colors
	- Google web fonts
	- webfontloader
	- font awesome via npm
	- datepicker css (manual copy of last 30 lines, created custom)
	- bootstrap custom (do not need navs, nav bars, breadcrumbs, pag, page, thumbnails, progress bars, media items, panels, wells, dropdowns, popovers, modals, carousel, OR carousel functinoality, dropdowns, modals, popovers, togglable tabs, affix, collaps, scrollspy, transitions)
	- brand-primary #48525D success #567256  warning #8e7e6c  danger #8e6c6c  info #96a6ac
- Scaffolding
	- Show create button only when data is selected?
- Share [simplesharebuttons.com/html-share-buttons/]()
- Optimization
	- Load scripts, css, fonts from CDN? (maybe)
	- cache.manifest (grunt-manifest)
- Fixes
	- npm update (usemin to fix dist .tmp css error, comment out cssmin?)
	- errors
- Documentation

## Future

- Pass data by url
- Offline access
- i18n
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
