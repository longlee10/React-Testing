import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

describe("Order Status Selector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      button: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"), // postpone the finding of elements by converting the code to a function
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
      user: userEvent.setup(),
      onChange,
    };
  };

  it("should render new as default value", () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render all statuses", async () => {
    const { button, user, getOptions } = renderComponent();
    await user.click(button);

    const options = await getOptions();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  // testing interaction
  /* 
    click to render list -> click on the span of content -> check if the function is called with correct content
  */

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with $label if user select $value",
    async ({ label, value }) => {
      const { button, user, onChange, getOption } = renderComponent();
      await user.click(button);

      const option = await getOption(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with ''new' if user select New", async () => {
    const { button, user, onChange, getOption } = renderComponent();
    await user.click(button);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(button);
    const newOption = await getOption(/new/i);
    await user.click(newOption);

    expect(onChange).toHaveBeenCalledWith("new");
  });
});
