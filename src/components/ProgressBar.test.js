import React from "react";
import { render } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("shows progress loading", () => {
    const { container } = render(<ProgressBar progress={23} />);
    const prog = container.querySelector("progress");

    expect(prog.getAttribute("value")).toBe("23");
    expect(prog.getAttribute("max")).toBe("38");
  });
});
