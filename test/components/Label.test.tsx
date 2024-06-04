import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (language: Language, labelId: string) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("Language selection is EN", () => {
    it.each([
      { labelId: "welcome", text: "Welcome" },
      { labelId: "new_product", text: "New Product" },
      { labelId: "edit_product", text: "Edit Product" },
    ])("should render $text", ({ labelId, text }) => {
      renderComponent("en", labelId);

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("Language selection is ES", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render $text", ({ labelId, text }) => {
      renderComponent("es", labelId);

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("should display error for invalid label id", () => {
    expect(() => renderComponent("en", "!")).toThrowError();
    expect(() => renderComponent("es", "!")).toThrowError();
  });
});
