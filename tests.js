var validAttribute = "<a href='blah' attr=\"bar\">test</a>";
describe("Regex tests", function() {
    it("matches two opening HTML tags without a closing tag", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div    <div>").index).toBe(0);
    });

    it("doesn't match two opening HTML tags with a closing tag in between", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div>    <div>")).toBe(null);
    });

    it("doesn't fail any regex for valid HTML tags", function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            expect(Tecate.errors[i].regex.exec("<div>    <div><img/></div>")).toBe(null);
        }
    });

    it("doesn't fail any regex for valid HTML attributes", function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            expect(Tecate.errors[i].regex.exec(validAttribute)).toBe(null);
        }
    });

    it("breaks if you forget an equals sign", function() {
        expect(Tecate.missingEquals.regex.exec("<a href\"cool\">link</a>").index).toBe(0);
    });

    it("detects when you forget a opening quotation after the equals sign", function() {
        expect(Tecate.missingQuoteAfterEquals.regex.exec("<a href=cool\">link</a>").index).toBe(3);
    });

    it("detects when you forget a opening single quotation after the equals sign", function() {
        expect(Tecate.missingQuoteAfterEquals.regex.exec("<a href=cool\'>link</a>").index).toBe(3);
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
