import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { User } from "firebase/auth";

import { useUser } from "@/hooks/useUser";
import DashboardLayout from "@/app/(dashboard)/layout";

vi.mock("@/hooks/useUser");
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("@/components/Navbar", () => ({ default: () => <nav>Navbar</nav> }));
vi.mock("@/lib/firebase", () => ({ auth: {} }));

import { useRouter } from "next/navigation";

describe("DashboardLayout", () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ replace: mockReplace } as never);
    mockReplace.mockReset();
  });

  it("renders children when authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "123" } as User,
      loading: false,
    });
    render(<DashboardLayout>Dashboard content</DashboardLayout>);

    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("shows spinner (not children) while loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });
    render(<DashboardLayout>Dashboard content</DashboardLayout>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });

  it("redirects to /login and shows spinner when unauthenticated", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
    render(<DashboardLayout>Dashboard content</DashboardLayout>);

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
  });
});
