import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Dial from "./Dial";

describe("Dial", () => {
  it("renders an svg", () => {
    const { container } = render(<Dial data={[]} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
