var validAttribute = "<a href='blah' attr=\"bar\">test</a>";
describe("Regex tests", function() {
    it("matches two opening HTML tags without a closing tag", function() {
        expect("<div    <div>").toMatch(Tecate.missingClosingTag.regex);
    });

    it("doesn't match two opening HTML tags with a closing tag in between", function() {
        expect("<div>    <div>").toMatch(Tecate.missingClosingTag.regex);
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

    it("breaks if you forget an equals sign", function() {
        expect("<a href\"cool\">link</a>").toMatch(Tecate.missingEquals.regex);
    });

    it("equals sign match isn't too broad", function() {
        expect(Tecate.missingEquals.regex.exec("<div> <div><div><a href\"cool\">link</a>").index).toBe(16);
    });

    it("detects when you forget a opening quotation after the equals sign", function() {
        expect("<a href=cool\">link</a>").toMatch(Tecate.missingQuoteAfterEquals);
    });

    it("detects when you forget a opening single quotation after the equals sign", function() {
        expect("<a href=cool\'>link</a>").toMatch(Tecate.missingQuoteAfterEquals.regex);
    });

    it("strips comments from html", function() {
        expect(Tecate.stripComments("hey<!-- <<<<a href='comment'>--><")).toBe("hey<");
    });

    it("escapes unsafe HTML", function() {
        expect(Tecate.escapeHTML("<>\"&")).toBe("&lt;&gt;&quot;&amp;");
    });

    afterEach(function() {
        // reset the exec() calls in js. if someone knows a better way to do
        // global searches with matching, let me know.
        for (var i = 0; i < Tecate.errors.length; i++) {
            Tecate.errors[i].regex.lastIndex = 0;
        }
    });
});
