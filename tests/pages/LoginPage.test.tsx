import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { signInWithEmailAndPassword } from "firebase/auth";

import LoginPage from "@/app/(public)/login/page";

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>();
  return { ...actual, signInWithEmailAndPassword: vi.fn() };
});
vi.mock("@/lib/firebase", () => ({ auth: {} }));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(signInWithEmailAndPassword).mockReset();
  });

  async function fillAndSubmit(
    email = "test@example.com",
    password = "secret123",
  ) {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), email);
    await user.type(screen.getByLabelText("Password"), password);
    await user.click(screen.getByRole("button", { name: "Log In" }));
  }

  it("shows success message on successful login", async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as never);
    render(<LoginPage />);

    await fillAndSubmit();

    expect(screen.getByText("Login successful")).toBeInTheDocument();
  });

  it("shows error message on invalid credentials", async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
      code: "auth/invalid-credential",
    });
    render(<LoginPage />);

    await fillAndSubmit();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Incorrect email or password.",
    );
  });

  it("shows error message when user not found", async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
      code: "auth/user-not-found",
    });
    render(<LoginPage />);

    await fillAndSubmit();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No account found with that email.",
    );
  });

  it("disables the button while the request is pending", async () => {
    let resolve!: () => void;
    vi.mocked(signInWithEmailAndPassword).mockReturnValue(
      new Promise((res) => {
        resolve = () => res({} as never);
      }),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled();

    await act(async () => {
      resolve();
    });
  });

  it("re-enables the button after the request completes", async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as never);
    render(<LoginPage />);

    await fillAndSubmit();

    expect(screen.getByRole("button", { name: "Log In" })).not.toBeDisabled();
  });

  it("clears previous success/error state on resubmit", async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as never);
    render(<LoginPage />);

    await fillAndSubmit();
    expect(screen.getByText("Login successful")).toBeInTheDocument();

    let resolve!: () => void;
    vi.mocked(signInWithEmailAndPassword).mockReturnValue(
      new Promise((res) => {
        resolve = () => res({} as never);
      }),
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.queryByText("Login successful")).not.toBeInTheDocument();

    await act(async () => {
      resolve();
    });
  });
});
