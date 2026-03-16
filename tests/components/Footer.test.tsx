import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the brand text", () => {
    render(<Footer />);

    expect(screen.getByText(/Pocket Heist/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan your tiny missions/i)).toBeInTheDocument();
  });

  it("renders social icon links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "#",
    );
    expect(screen.getByRole("link", { name: /twitter/i })).toHaveAttribute(
      "href",
      "#",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "#",
    );
  });

  it("renders a footer landmark", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
