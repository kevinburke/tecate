var Tecate = Tecate || {};

Tecate.missingClosingTag = {
    'regex': new RegExp("(<[^>]+)<", "g"),
    'message': "Opening tag with no closing tag"
},
Tecate.missingEquals = {
    'regex': new RegExp("(<(.*)[^=]+['\"]\\S+['\"])", "g"),
    'message': "Missing equals sign for attribute"
},
Tecate.missingQuoteAfterEquals = {
    'regex': new RegExp("(\\S+=[^'\"]+['\"])[ >]", "g"),
    'message': "Missing quote after equals sign for attribute"
},
Tecate.missingQuoteAtEndOfAttribute = {
    'regex': new RegExp("(\\S+=['\"][^'\" >]+)[ >]", "g"),
    'message': "Missing quote at the end of the attribute"
};

Tecate.errors = [
    Tecate.missingQuoteAtEndOfAttribute,
    Tecate.missingQuoteAfterEquals,
    Tecate.missingClosingTag,
    Tecate.missingEquals
];

Tecate.getPageSource = function(callback) {
    return $.get('', function(data) {
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

Tecate.getErrorLines = function(idx) {
    // XXX
    return idx;
};

Tecate.stripComments = function(html) {
    return html.replace(/<!--(.*)-->/g, "");
};

Tecate.evaluateHtml = function(html) {
    var result;
    var errorsList = [];
    var commentFreeHtml = Tecate.stripComments(html);
    console.log(commentFreeHtml);
    for (var i = 0; i < Tecate.errors.length; i++) {
        var error = Tecate.errors[i];
        while ((result = error.regex.exec(commentFreeHtml)) !== null) {
            console.log(result[1]);
            errorsList.push({
                'errorString': error.message,
                'error': result[1],
                'line': Tecate.getErrorLines(result.index, html),
                'html': html
            });
        }
    }
    Tecate.showErrors(errorsList);
};

$(function() {
    if (!Tecate.test) {
        Tecate.getPageSource(Tecate.evaluateHtml);
    }
});
