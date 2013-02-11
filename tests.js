describe("Regex tests", function() {
    it("matches two opening HTML tags without a closing tag", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div    <div>").index).toBe(0);
    });

    it("doesn't match two opening HTML tags with a closing tag in between", function() {
        expect(Tecate.missingClosingTag.regex.exec("<div>    <div>")).toBe(null);
    });

    it("strips comments from html", function() {
        expect(Tecate.stripComments("hey<!-- <<<<a href='comment'>--><")).toBe("hey<");
    });
});
