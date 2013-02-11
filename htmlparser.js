$(function() {

    var errorDivName = 'htmlparser-errors';
    var $error = '#' + errorDivName;

    var getPageSource = function(callback) {
        return $.get('', function(data) {
            callback(data);
        });
    };

    var insertErrorDiv = function(errorString, err) {
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
                marginBottom: '7px',
            }
        );
        $div.append(list);
        $('body').prepend($div);
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

    var appendError = function(error) {
        $("#htmlparser-errors-list").append($("<li>" + error.errorString + ': ' + error.error + ' on line ' + error.line + "</li>"));
    };

    var getErrorLines = function(idx, html) {
        // XXX
        return idx;
    };

    var missingTrailingAttributeQuote = /(\S+=['"][^'" ]+) /g;
    var missingOpeningAttributeQuote = /(\S+=[^'"]+['"])[ >]/g;
    var evaluateHtml = function(html) {
        var result;
        var errorsList = [];
        while ((result = missingOpeningAttributeQuote.exec(html)) !== null) {
            errorsList.push({
                'errorString': "Missing quote after equals sign for attribute",
                'error': result[1],
                'line': getErrorLines(result.index, html),
                'html': html
            });
        }
        showErrors(errorsList);
    };

    getPageSource(evaluateHtml);
});
