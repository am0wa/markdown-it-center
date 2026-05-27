import MarkdownIt from "markdown-it";
import { describe, expect, it } from "vitest";
import markdownItCenter from "center-it-plugin.js";

const md = new MarkdownIt().use(markdownItCenter);

describe("basic centering", () => {
  it("centers plain text", () => {
    expect(md.render("->Hello<-").trim()).toBe(
      '<p style="text-align:center">Hello</p>',
    );
  });

  it("trims whitespace inside markers", () => {
    expect(md.render("-> Hello <-").trim()).toBe(
      '<p style="text-align:center">Hello</p>',
    );
  });

  it("leaves normal paragraphs unchanged", () => {
    expect(md.render("Normal paragraph").trim()).toBe(
      "<p>Normal paragraph</p>",
    );
  });

  it("does not center empty markers", () => {
    expect(md.render("-><-")).not.toContain("text-align");
  });

  it("does not center when close marker is missing", () => {
    expect(md.render("->no close")).not.toContain("text-align");
  });
});

describe("headings", () => {
  it("centers an h1 heading", () => {
    expect(md.render("# ->Title<-").trim()).toBe(
      '<h1 style="text-align:center">Title</h1>',
    );
  });

  it("centers an h2 heading", () => {
    expect(md.render("## ->Section<-").trim()).toBe(
      '<h2 style="text-align:center">Section</h2>',
    );
  });
});

describe("inline markup preservation", () => {
  it("centers bold text", () => {
    const out = md.render("->**bold**<-");
    expect(out).toContain("text-align:center");
    expect(out).toContain("<strong>bold</strong>");
  });

  it("centers italic text", () => {
    const out = md.render("->_italic_<-");
    expect(out).toContain("text-align:center");
    expect(out).toContain("<em>italic</em>");
  });

  it("centers a link", () => {
    const out = md.render("->[Link](https://example.com/)<-");
    expect(out).toContain("text-align:center");
    expect(out).toContain('<a href="https://example.com/">Link</a>');
  });
});

describe("options", () => {
  it("adds className while keeping default style", () => {
    const m = new MarkdownIt().use(markdownItCenter, {
      className: "text-center",
    });
    const out = m.render("->Hello<-");
    expect(out).toContain('class="text-center"');
    expect(out).toContain('style="text-align:center"');
  });

  it("suppresses inline style when style is empty string", () => {
    const m = new MarkdownIt().use(markdownItCenter, {
      className: "tc",
      style: "",
    });
    const out = m.render("->Hello<-");
    expect(out).toContain('class="tc"');
    expect(out).not.toContain("style=");
  });

  it("uses a custom style value", () => {
    const m = new MarkdownIt().use(markdownItCenter, {
      style: "text-align:center;color:red",
    });
    expect(m.render("->Hello<-")).toContain(
      'style="text-align:center;color:red"',
    );
  });
});

describe("blockquotes", () => {
  it("centers paragraph inside blockquote with inline syntax", () => {
    const out = md.render("> ->some quote<-");
    expect(out).toContain('<p style="text-align:center">some quote</p>');
  });

  it("centers paragraphs inside blockquote with fence syntax", () => {
    const out = md.render("-->\n\n> some quote\n>\n> — Franklin\n\n<--");
    expect(out).toContain('<p style="text-align:center">some quote</p>');
    expect(out).toContain('<p style="text-align:center">— Franklin</p>');
  });

  it("does not add style to the blockquote wrapper itself", () => {
    const out = md.render("-->\n\n> some quote\n\n<--");
    expect(out).toContain("<blockquote>");
    expect(out).not.toContain("<blockquote style=");
  });
});

describe("fence/block mode", () => {
  it("centers heading and paragraph in fence", () => {
    const out = md.render("-->\n\n## Title\n\nBody.\n\n<--");
    expect(out).toContain('<h2 style="text-align:center">Title</h2>');
    expect(out).toContain('<p style="text-align:center">Body.</p>');
  });

  it("removes fence marker lines from output", () => {
    const out = md.render("-->\n\n## Title\n\nBody.\n\n<--");
    expect(out).not.toContain("-->");
    expect(out).not.toContain("<--");
  });

  it("produces empty output for empty fence", () => {
    expect(md.render("-->\n\n<--").trim()).toBe("");
  });

  it("leaves unclosed fence unchanged", () => {
    const out = md.render("-->\n\nNo close");
    expect(out).not.toContain("text-align");
    expect(out).toContain("No close");
  });

  it("centers two independent fences independently", () => {
    const out = md.render(
      "-->\n\nFirst.\n\n<--\n\nNormal.\n\n-->\n\nSecond.\n\n<--",
    );
    const centered = out.match(/style="text-align:center"/g);
    expect(centered).toHaveLength(2);
    expect(out).toContain("<p>Normal.</p>");
  });

  it("fence and inline syntax coexist", () => {
    const out = md.render("-->\n\nBlock.\n\n<--\n\n->Inline<-");
    expect(out).toContain('<p style="text-align:center">Block.</p>');
    expect(out).toContain('<p style="text-align:center">Inline</p>');
  });

  it("inline syntax inside fence produces exactly one style attr", () => {
    const out = md.render("-->\n\n->Hello<-\n\n<--");
    expect(out).toContain('<p style="text-align:center">Hello</p>');
    expect(out).not.toContain("text-align:center text-align:center");
  });

  it("applies className and suppressed style inside fence", () => {
    const m = new MarkdownIt().use(markdownItCenter, {
      className: "tc",
      style: "",
    });
    const out = m.render("-->\n\nBlock.\n\n<--");
    expect(out).toContain('class="tc"');
    expect(out).not.toContain("style=");
  });
});
