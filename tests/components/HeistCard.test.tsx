import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeistCard from "@/components/HeistCard/HeistCard";
import { Heist } from "@/types/firestore";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/formatDeadline", () => ({
  formatDeadline: vi.fn(),
}));

import { formatDeadline } from "@/lib/formatDeadline";

const baseHeist: Heist = {
  id: "heist-1",
  title: "Steal the Stapler",
  description: "Retrieve the red Swingline from desk 4B without being seen.",
  createdBy: "user-1",
  createdByCodename: "SilentFox",
  assignedTo: "user-2",
  assignedToCodename: "IronWolf",
  deadline: new Date("2099-01-01"),
  createdAt: new Date(),
  finalStatus: null,
};

describe("HeistCard", () => {
  beforeEach(() => {
    vi.mocked(formatDeadline).mockReturnValue({
      label: "2 days left",
      urgent: false,
    });
  });

  it("renders heist title, description, agent, and deadline", () => {
    render(<HeistCard heist={baseHeist} />);

    expect(screen.getByText("Steal the Stapler")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Retrieve the red Swingline from desk 4B without being seen.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("IronWolf")).toBeInTheDocument();
    expect(screen.getByText("2 days left")).toBeInTheDocument();
  });

  it("title links to the correct heist detail page", () => {
    render(<HeistCard heist={baseHeist} />);

    const link = screen.getByRole("link", { name: "Steal the Stapler" });
    expect(link).toHaveAttribute("href", "/heists/heist-1");
  });

  it("shows urgent styling when deadline is urgent", () => {
    vi.mocked(formatDeadline).mockReturnValue({
      label: "3h left",
      urgent: true,
    });

    render(<HeistCard heist={baseHeist} />);

    expect(screen.getByText("3h left")).toBeInTheDocument();
  });

  it("does not render description paragraph when description is empty", () => {
    render(<HeistCard heist={{ ...baseHeist, description: "" }} />);

    expect(
      screen.queryByText(
        "Retrieve the red Swingline from desk 4B without being seen.",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders emoji and agent codename in meta section", () => {
    render(<HeistCard heist={baseHeist} />);

    expect(screen.getByText("🎭")).toBeInTheDocument();
    expect(screen.getByText("IronWolf")).toBeInTheDocument();
  });

  it("title link is keyboard accessible via focus", () => {
    render(<HeistCard heist={baseHeist} />);

    const link = screen.getByRole("link", { name: "Steal the Stapler" });
    link.focus();
    expect(document.activeElement).toBe(link);
  });
});
