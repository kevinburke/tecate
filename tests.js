var validAttribute = "<a href='blah' attr=\"bar\">test</a>";
describe("Regex tests", function() {
    it("matches two opening HTML tags without a closing tag", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div    <div>").index).toBe(0);
    });

    it("doesn't match two opening HTML tags with a closing tag in between", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div>    <div>")).toBe(null);
    });

    it("doesn't match a valid html attribute", function() {
        expect(Tecate.missingClosingTag.regex.exec(validAttribute)).toBe(null);
    });

    it("doesn't match valid HTML attributes", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div>    <div>")).toBe(null);
    });

    it("missing quote regex doesn't match valid attributes", function() {
        expect(Tecate.missingQuoteAfterEquals.regex.exec(validAttribute)).toBe(null);
    });

    it("detects when you forget a opening quotation after the equals sign", function() {
        expect(Tecate.missingQuoteAfterEquals.regex.exec("<a href=cool\">link</a>").index).toBe(3);
    });

    it("detects when you forget a opening single quotation after the equals sign", function() {
        expect(Tecate.missingQuoteAfterEquals.regex.exec("<a href=cool\'>link</a>").index).toBe(3);
    });

    it("missing end quote regex doesn't match valid attributes", function() {
        expect(Tecate.missingQuoteAtEndOfAttribute.regex.exec(validAttribute)).toBe(null);
    });

    it("strips comments from html", function() {
        expect(Tecate.stripComments("hey<!-- <<<<a href='comment'>--><")).toBe("hey<");
    });

    it("escapes unsafe HTML", function() {
        expect(Tecate.escapeHTML("<>\"&")).toBe("&lt;&gt;&quot;&amp;");
    });

    afterEach(function() {
        for (var i = 0; i < Tecate.errors.length; i++) {
            Tecate.errors[i].regex.lastIndex = 0;
        }
    });
});
