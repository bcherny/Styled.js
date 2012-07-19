## Styled.js

High performance, dependency free, cross-browser styled `<select>`'s

## Browser support

- Chrome
- Firefox
- iOS
- Internet Explorer 6+
- Safari
- Opera

## Usage

### 1. Include the Styled.js stylesheet at the end of your document's `<head>`

```html
<link rel="stylesheet" type="text/css" href="stylesheets/styled.css" />
```

### 2. Include the Styled.js javascript at the end of your document, right before the closing `</body>` tag

If using the dependency-free version:

```html
<script type="text/javascript" src="javascripts/styled.js"></script>
```

Or if using the Mootools version,

```html
<script type="text/javascript" src="javascripts/lib/mootools-core-1.4.5.js"></script>
<script type="text/javascript" src="javascripts/styled.mootools.js"></script>
```

### 3. (Optional) To enable Internet Explorer 6/7 support:

Replace your document's opening `<html>` tag with

```html
<!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7"> <![endif]-->
<!--[if (gt IE 7)|!(IE)]><!--> <html class=""> <!--<![endif]-->
```

### 4. Add the "styled" class to any `<select>`'s you want to style:

```html
<select class="styled">
	...
</select>
```

## Example

```html
<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7"> <![endif]-->
<!--[if (gt IE 7)|!(IE)]><!--> <html class=""> <!--<![endif]-->
<head>
	<title>Styled.js</title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="language" content="en" />

	<link rel="stylesheet" type="text/css" href="stylesheets/styled.css" />
</head>
<body>

	<select class="styled">
		<option value="red">Red</option>
		<option value="orange">Orange</option>
		<option value="yellow">Yellow</option>
		<option value="green">Green</option>
		<option value="blue">Blue</option>
		<option value="purple">Purple</option>
	</select>

	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js"></script>
	<script type="text/javascript" src="javascripts/styled.mootools.js"></script>

</body>
</html>
```
## Live Demo

http://jsfiddle.net/Bgj5x/

## To Do

- Add unit tests
- Add configurable options
- Add support for checkboxes & radio buttons

## License

Modify and distribute as you wish!