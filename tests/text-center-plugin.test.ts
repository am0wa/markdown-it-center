import MarkdownIt from "markdown-it";
import { describe, expect, it } from "vitest";
import markdownItTextCenter from "text-center-plugin.js";

const md = new MarkdownIt().use(markdownItTextCenter);

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
    const m = new MarkdownIt().use(markdownItTextCenter, {
      className: "text-center",
    });
    const out = m.render("->Hello<-");
    expect(out).toContain('class="text-center"');
    expect(out).toContain('style="text-align:center"');
  });

  it("suppresses inline style when style is empty string", () => {
    const m = new MarkdownIt().use(markdownItTextCenter, {
      className: "tc",
      style: "",
    });
    const out = m.render("->Hello<-");
    expect(out).toContain('class="tc"');
    expect(out).not.toContain("style=");
  });

  it("uses a custom style value", () => {
    const m = new MarkdownIt().use(markdownItTextCenter, {
      style: "text-align:center;color:red",
    });
    expect(m.render("->Hello<-")).toContain(
      'style="text-align:center;color:red"',
    );
  });
});
