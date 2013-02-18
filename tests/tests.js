var validAttribute = "<a href='blah' attr=\"bar\">test</a>";
describe("Regex error matching tests", function() {
    it("matches two opening HTML tags without a closing tag", function() {
        expect("<div    <div>").toMatch(Tecate.missingClosingBracket.regex);
    });

    it("doesn't match two opening HTML tags with a closing bracket in between", function() {
        expect("<div>    <div>").not.toMatch(Tecate.missingClosingBracket.regex);
    });

    it("doesn't fail any regex for valid HTML tags", function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            expect("<div>  <div><img/></div>").not.toMatch(Tecate.errors[i].regex);
        }
    });

    it("doesn't fail any regex for valid HTML attributes", function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            expect(validAttribute).not.toMatch(Tecate.errors[i].regex);
        }
    });

    it("passes for spaced class declarations", function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            expect("<a class='cool beans'>link</a>").not.toMatch(Tecate.errors[i].regex);
        }
    });

    it("passes for single-html elements with quotes", function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            expect("<img src='blah'/>").not.toMatch(Tecate.errors[i].regex);
        }
    });

    it("breaks if you forget an equals sign", function() {
        expect("<a href\"cool\">link</a>").toMatch(Tecate.missingEquals.regex);
    });

    it("equals sign match isn't too broad", function() {
        expect(Tecate.missingEquals.regex.exec("<div> <div><div><a href\"cool\">link</a>").index).toBe(16);
    });

    it("computes match indexes the way I believe it does", function() {
        expect(new RegExp("bar").exec("foo\nbar").index).toBe(4);
    });

    it("detects when you forget a opening quotation after the equals sign", function() {
        expect("<a href=cool\">link</a>").toMatch(Tecate.missingQuoteAfterEquals.regex);
    });

    it("detects when you forget a opening single quotation after the equals sign", function() {
        expect("<a href=cool'>link</a>").toMatch(Tecate.missingQuoteAfterEquals.regex);
    });

    it("doesnt match an equals sign in the middle of a quote", function() {
        expect("<a href='cool=bar'>link</a>").not.toMatch(Tecate.missingQuoteAfterEquals.regex);
    });

    it("detects when you don't end an attribute with a single quote", function() {

        expect("<a href=\'cool>link</a>").toMatch(Tecate.missingQuoteAtEndOfAttribute.regex);
    });

    var ampersands = '<a class="button" href="./index.php?m=tasks&amp;a=todo"><span><b>My Tasks</b></span></a>';
    it("fixes casey's html string", function() {
        expect(ampersands).not.toMatch(Tecate.missingQuoteAtEndOfAttribute.regex);
    });

    it("detects quote matches when you have two attributes", function() {

        expect("<a href=\'cool class='blah'>link</a>").toMatch(Tecate.missingQuoteAtEndOfAttribute.regex);
    });

    it("escapes unsafe HTML", function() {
        expect(Tecate.escapeHTML("<>\"&")).toBe("&lt;&gt;&quot;&amp;");
    });

    it("checks for invalid characters", function() {
        expect("<imput type='text' />").toMatch(Tecate.invalidHTMLElement.regex);
    });

    it("does not match valid HTML elements", function() {
        expect("<html>").not.toMatch(Tecate.invalidHTMLElement.regex);
    });

    it("does not match valid closing elements", function() {
        expect("</html>").not.toMatch(Tecate.invalidHTMLElement.regex);
    });

    it("does not match valid closing elements with spaces", function() {
        expect("< / html>").not.toMatch(Tecate.invalidHTMLElement.regex);
    });

    afterEach(function() {
        // reset the exec() calls in js. if someone knows a better way to do
        // global searches with matching, let me know.
        for (var i = 0; i < Tecate.errors.length; i++) {
            Tecate.errors[i].regex.lastIndex = 0;
        }
    });
});

var script = "<script type='text/javascript' src='foo'></script>";
var scriptWithContent = "<script>alert(blah);</script>";
var style = "<style>* { width: 100; } /* this is a comment */ foo > bar { blah; }</style>";

describe("Tecate tests", function() {
    it("correctly detects line numbers for an index", function() {
        expect(Tecate.getErrorLines(2, "<html>\n<head>")).toBe(1);
        expect(Tecate.getErrorLines(8, "<html>\n<head>")).toBe(2);
        expect(Tecate.getErrorLines(20, "<html>\n<head>")).toBe(2);
        expect(Tecate.getErrorLines(7, "blah\nbar\nfoo")).toBe(2);
        expect(Tecate.getErrorLines(9, "blah\nbar\nfoo\ncoo")).toBe(3);
    });

    it("strips comments from html", function() {
        expect(Tecate.stripComments("hey<!-- <<<<a href='comment'>--><")).toBe("hey<");
        expect(Tecate.stripComments("hey<!--comment --  ><")).toBe("hey<");
    });

    it("strips multiline comments", function() {
        expect(Tecate.stripComments("hey<!--comment\n --  ><")).toBe("hey<");
    });

    it("strips javascripts from html", function() {

        expect(Tecate.stripTag(script, "script")).toBe("");
        expect(Tecate.stripTag(script, "script")).toBe("");
    });

    it("strips style tags from html", function() {

        expect(Tecate.stripTag(style, "style")).toBe("");
    });
});
