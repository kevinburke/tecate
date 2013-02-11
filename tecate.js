var htmlparser = htmlparser || {};

htmlparser.errors = [{
    'regex': new RegExp("(\\S+=[^'\"]+['\"])[ >]", "g"),
    'message': "Missing quote after equals sign for attribute"
}, {
    'regex': new RegExp("(\\S+=['\"][^'\" >]+)[ >]", "g"),
    'message': "Missing quote at the end of the attribute"
}];

htmlparser.errorDivName = 'htmlparser-errors';

htmlparser.getPageSource = function(callback) {
    return $.get('', function(data) {
        callback(data);
    });
};

htmlparser.insertErrorDiv = function() {
    var list = $("<ul id='htmlparser-errors-list'></ul>").css({
        padding: 0,
        margin: 0
    });
    var $div = $("<div id='" + htmlparser.errorDivName + "'>" + "</div>").css({
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

htmlparser.appendError = function(error) {
    $("#htmlparser-errors-list").append($("<li>" + error.errorString + ': <code>' + error.error + '</code> on line ' + error.line + "</li>"));
};

htmlparser.showErrors = function(errorsList) {
    if (errorsList.length === 0) {
        return;
    }
    htmlparser.insertErrorDiv();
    for (var i = 0; i < errorsList.length; i++) {
        htmlparser.appendError(errorsList[i]);
    }
};

htmlparser.getErrorLines = function(idx) {
    // XXX
    return idx;
};

htmlparser.evaluateHtml = function(html) {
    var result;
    var errorsList = [];
    for (var i = 0; i < htmlparser.errors.length; i++) {
        var error = htmlparser.errors[i];
        while ((result = error.regex.exec(html)) !== null) {
            errorsList.push({
                'errorString': error.message,
                'error': result[1],
                'line': htmlparser.getErrorLines(result.index, html),
                'html': html
            });
        }
    }
    htmlparser.showErrors(errorsList);
};

$(function() {
    htmlparser.getPageSource(htmlparser.evaluateHtml);
});
