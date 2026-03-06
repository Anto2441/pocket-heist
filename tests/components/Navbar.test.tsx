import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { User } from "firebase/auth";

// component imports
import Navbar from "@/components/Navbar";
import { useUser } from "@/hooks/useUser";
import { auth } from "@/lib/firebase";

vi.mock("@/hooks/useUser");
vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>();
  return { ...actual, signOut: vi.fn() };
});
vi.mock("@/lib/firebase", () => ({ auth: {} }));

describe("Navbar", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
  });

  it("renders the main heading", () => {
    render(<Navbar />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    render(<Navbar />);

    const createLink = screen.getByRole("link", { name: /create heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("does not show logout button when user is null", () => {
    render(<Navbar />);

    expect(
      screen.queryByRole("button", { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  it("does not show logout button while loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });
    render(<Navbar />);

    expect(
      screen.queryByRole("button", { name: /log out/i }),
    ).not.toBeInTheDocument();
  });

  it("shows logout button when user is authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "123" } as User,
      loading: false,
    });
    render(<Navbar />);

    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", async () => {
    const { signOut } = await import("firebase/auth");
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "123" } as User,
      loading: false,
    });
    render(<Navbar />);

    await userEvent.click(screen.getByRole("button", { name: /log out/i }));

    expect(signOut).toHaveBeenCalledWith(auth);
  });
});
