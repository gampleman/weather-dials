import React from "react";
import LocationSearch from "./LocationSearch";
import { render } from "@testing-library/react";

describe("LocationSearch", () => {
  it("shows a search bar for the location", () => {
    const { getByLabelText } = render(<LocationSearch />);
    expect(getByLabelText("City:")).toBeInTheDocument();
  });
});
