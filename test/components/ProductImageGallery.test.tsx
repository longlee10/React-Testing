import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";
import React from "react";
import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("Product Image Gallery", () => {
  it("should return empty DOM if the url list is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should return a list of image with the rigth src attribute", () => {
    const imageUrls = ["url1", "url2"];

    render(<ProductImageGallery imageUrls={imageUrls} />);
    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(2);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url); // compare 2 arrays
    });
  });
});
