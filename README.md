## Tecate.js

Writing HTML is hard. Let's go shopping

### Catching Bugs

Tecate will display an error message if you messed up your HTML. Here are some
of the bugs it can catch for you:

##### Missing a Closing Tag

Say you forgot to close a div, or closed it badly:

```html
<div class="foo"
    Some text
</div>
```

Tecate will catch it and warn you:

    Opening tag with no closing tag: <div class="foo" on line 2

##### Missing Equals Sign For Attribute

```html
<div class"foo">
    Some text
</div>
```

Tecate will catch it and warn you:

    Missing equals sign for attribute: <div class"foo" on line 17

##### Missing Opening or Closing Attribute Quotes

These are some of the most pernicious.

```html
<div class=foo">
    <a href="blah>Some text</a>
</div>
```

### Usage

Drop this into the &lt;head> of your HTML document, like this:

```html
<!doctype html>
<html>
    <head>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://raw.github.com/kevinburke/tecate/master/tecate.js">
        <!-- ... more files in the head ... -->
    </head>
    <body>
    <!-- ... the body content ... -->
    </body>
</html>
```
