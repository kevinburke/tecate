$(function() {

    var errorDiv = 'htmlparser-errors';
    var $error = '#' + errorDiv;

    var getPageSource = function(callback) {
        return $.get('', function(data) {
            callback(data);
        });
    };

    var getErrorDiv = function(errorString, err) {
        return $("<div id='" + errorDiv + "'>" + errorString + ": " + err +
            "</div>"
            ).css({
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
    };

    var showError = function(errorString, err, index, html) {
        if ($($error).length === 0) {
            $('body').prepend(getErrorDiv(errorString, err));
        }
    };

    var missingTrailingAttributeQuote = /(\S+=['"][^'" ]+) /g;
    var missingOpeningAttributeQuote = /(\S+=[^'"]+['"])[ >]/g;
    var evaluateHtml = function(html) {
        var result;
        while ((result = missingOpeningAttributeQuote.exec(html)) !== null) {
            showError("Missing quote after equals sign for attribute", result[1], result[2], html);
        }
    };

    getPageSource(evaluateHtml);
});
