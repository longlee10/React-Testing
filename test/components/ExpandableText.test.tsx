import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

describe("Expandable text", () => {
  const renderComponent = (text: string) => {
    render(<ExpandableText text={text} />);

    return {
      article: screen.getByRole("article"),
      getButton: () => screen.getByRole("button"),
      queryButton: () => screen.queryByRole("button"),
    };
  };

  it("should display the whole text if the length is < 255 and display no button", () => {
    const text = "Hello World";
    const { article, queryButton } = renderComponent(text);

    expect(article).toHaveTextContent(text);
    expect(queryButton()).not.toBeInTheDocument();

    // note: can use get by text
  });

  /* 
    long text: truncate & show more button
    click show more: return full text && change button to show less
  */
  it("should truncate the text if length is > 255 and display a button", async () => {
    const text = "a".repeat(256);
    const { article, getButton } = renderComponent(text);
    const button = getButton();

    // initally, the text is not expanded
    const truncatedText = text.substring(0, 255) + "...";
    expect(article).toHaveTextContent(truncatedText);
    expect(button).toHaveTextContent(/More/i);

    // user now expand text
    const user = userEvent.setup();
    await user.click(button);
    expect(button).toHaveTextContent(/Less/i);
    expect(article).toHaveTextContent(text);

    // user now collapse text
    await user.click(button);
    expect(button).toHaveTextContent(/More/i);
    expect(article).toHaveTextContent(truncatedText);
  });

  // note: re-code: test trunccated text 2 cases + button label
  // test show less and show more functionality (2 cases)
});

describe("Expandable Text 2", () => {
  const limit = 255;
  const shortText = "Hello World";
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";

  const renderComponent = (text: string) => {
    render(<ExpandableText text={text} />);

    return {
      getShortText: () => screen.getByText(shortText),
      getTruncatedText: () => screen.getByText(truncatedText),
      getLongText: () => screen.getByText(longText),
      getButton: () => screen.getByRole("button"),
      user: userEvent.setup(),
    };
  };

  it("should return the text if its length is < 255", () => {
    const { getShortText } = renderComponent(shortText);

    expect(getShortText()).toBeInTheDocument();
  });

  it("should return the truncated text is lenght is > 255", () => {
    const { getTruncatedText, getButton } = renderComponent(longText);

    expect(getTruncatedText()).toBeInTheDocument();
    expect(getButton()).toHaveTextContent(/more/i);
  });

  // test interaction
  it("user expand text", async () => {
    const { user, getButton, getLongText } = renderComponent(longText);

    const button = getButton();
    await user.click(button);

    expect(getLongText()).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("user collapse text", async () => {
    const { getButton, user, getTruncatedText } = renderComponent(longText);

    // expand
    const button = getButton();
    await user.click(button);

    // collapse
    await user.click(button);
    expect(getTruncatedText()).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });
});
