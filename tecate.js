var htmlparser = htmlparser || {};

var errors = [{
    'regex': new RegExp("(\\S+=[^'\"]+['\"])[ >]", "g"),
    'message': "Missing quote after equals sign for attribute"
}, {
    'regex': new RegExp("(\\S+=['\"][^'\" ]+)[ >]", "g"),
    'message': "Missing quote at the end of the attribute"
}];

var errorDivName = 'htmlparser-errors';

var getPageSource = function(callback) {
    return $.get('', function(data) {
        callback(data);
    });
};

var insertErrorDiv = function() {
    var list = $("<ul id='htmlparser-errors-list'></ul>").css({
        padding: 0,
        margin: 0
    });
    var $div = $("<div id='" + errorDivName + "'>" + "</div>").css({
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

var appendError = function(error) {
    $("#htmlparser-errors-list").append($("<li>" + error.errorString + ': ' + error.error + ' on line ' + error.line + "</li>"));
};

var showErrors = function(errorsList) {
    if (errorsList.length === 0) {
        return;
    }
    insertErrorDiv();
    for (var i = 0; i < errorsList.length; i++) {
        appendError(errorsList[i]);
    }
};

var getErrorLines = function(idx) {
    // XXX
    return idx;
};

var evaluateHtml = function(html) {
    var result;
    var errorsList = [];
    for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        while ((result = error.regex.exec(html)) !== null) {
            errorsList.push({
                'errorString': error.message,
                'error': result[1],
                'line': getErrorLines(result.index, html),
                'html': html
            });
        }
    }
    showErrors(errorsList);
};

$(function() {
    getPageSource(evaluateHtml);

});
