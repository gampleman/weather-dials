import React from "react";
import LocationSearch from "./LocationSearch";
import { render, fireEvent } from "@testing-library/react";

describe("LocationSearch", () => {
  it("shows a search bar for the location", () => {
    const { getByLabelText } = render(<LocationSearch />);
    expect(getByLabelText("City:")).toBeInTheDocument();
  });

  it("allows you to start rendering", () => {
    const onRender = jest.fn();
    const { getByText, getByLabelText } = render(
      <LocationSearch onRender={onRender} />
    );
    const input = getByLabelText("City:");
    fireEvent.input(input, { target: { value: "Edinburgh" } });
    fireEvent.click(getByText("Render"));
    expect(onRender).toHaveBeenCalledWith("Edinburgh");
  });
});
