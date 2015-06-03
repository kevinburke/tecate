var Tecate = Tecate || {};

Tecate.validHTMLElements = [ "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "colgroup", "del", "details", "dfn", "dir", "div", "dl", "!doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "plaintext", "pre", "progress", "q", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp" ];

Tecate.missingClosingBracket = {
    'regex': new RegExp("(<[^>]+<)", "g"),
    'message': "Opening bracket with no closing bracket"
},
Tecate.invalidHTMLElement = {
    'regex': new RegExp("(<(?!/\?" + Tecate.validHTMLElements.join("\\b|/\?") + "\\b)[^ \n>]+)", "gi"),
    'message': "Opening HTML tag without a valid element name"
},
Tecate.missingEquals = {
    'regex': new RegExp("(<[^=>]+['\"]\\S+['\"]([^>]*>)?)", "g"),
    'message': "Missing equals sign for attribute"
},
Tecate.missingQuoteAfterEquals = {
    'regex': new RegExp("( [^\"']+=[^'\"]+['\"])[ >]", "g"),
    'message': "Missing quote after equals sign for attribute"
},
Tecate.missingQuoteAtEndOfAttribute = {
    'regex': new RegExp("(\\S+=['\"][^'\">]+(>|['\"][^ />]))", "g"),
    'message': "Missing quote at the end of the attribute"
};

Tecate.errors = [
    Tecate.missingQuoteAtEndOfAttribute,
    Tecate.missingQuoteAfterEquals,
    Tecate.missingClosingBracket,
    Tecate.missingEquals,
    Tecate.invalidHTMLElement
];

Tecate.getPageSource = function(callback) {
    return $.get(window.location.href, function(data) {
        callback(data);
    });
};

Tecate.insertErrorDiv = function() {
    var list = $("<ul id='tecate-errors-list'></ul>").css({
        padding: 0,
        margin: 0
    });
    var $div = $("<div id='tecate-errors'/>").css({
            backgroundColor: '#f2dede',
            padding: '10px 25px',
            border: '1px solid #eed3d7',
            borderRadius: '4px',
            color: '#b94a48',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '14px',
            marginBottom: '7px'
        }
    );
    $div.append(list);
    $('body').prepend($div);
};

Tecate.htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

Tecate.htmlEscaper = /[&<>"'\/]/g;

// Escape a string for HTML interpolation.
Tecate.escapeHTML = function(unsafe) {
  return ('' + unsafe).replace(Tecate.htmlEscaper, function(match) {
    return Tecate.htmlEscapes[match];
  });
};

Tecate.appendError = function(error) {
    $("#tecate-errors-list").append($("<li>" + error.errorString + ': <code>' + Tecate.escapeHTML(error.error) + '</code> on line ' + error.line + "</li>"));
};

Tecate.showErrors = function(errorsList) {
    if (errorsList.length === 0) {
        return;
    }
    Tecate.insertErrorDiv();
    for (var i = 0; i < errorsList.length; i++) {
        Tecate.appendError(errorsList[i]);
    }
};

Tecate.getErrorLines = function(idx, html) {
    var lines = html.split('\n');
    var count = 0;
    for (var i = 0; i < lines.length; i++) {
        count = count + lines[i].length;
        if (idx <= count) {
            return i + 1;
        }
    }
    return lines.length;
};

Tecate.stripComments = function(html) {
    return html.replace(/<!--([\s\S]*)--(\s*)>/g, "");
};

/**
 * Note, this is dumb - won't get dynamically inserted scripts or anything
 */
Tecate.stripTag = function(html, tagName) {
    return html.replace(new RegExp(
                "<" + tagName + "[^>]*>([\\s\\S]*)</" + tagName + ">", "g"), "");
};

// XXX this should return the errorsList and delegate to another function to
// render
Tecate.evaluateHTML = function(html) {
    var result;
    var errorsList = [];
    var noScripts = Tecate.stripTag(html, 'script');
    var noStyles = Tecate.stripTag(noScripts, 'style');
    var commentFreeHtml = Tecate.stripComments(noStyles);
    for (var i = 0; i < Tecate.errors.length; i++) {
        var error = Tecate.errors[i];
        while ((result = error.regex.exec(commentFreeHtml)) !== null) {
            errorsList.push({
                'errorString': error.message,
                'error': result[1],
                'line': Tecate.getErrorLines(html.indexOf(result[1]), html),
                'html': html
            });
        }
    }
    Tecate.showErrors(errorsList);
};

$(function() {
    if (!Tecate.test) {
        Tecate.getPageSource(Tecate.evaluateHTML);
    }
});
