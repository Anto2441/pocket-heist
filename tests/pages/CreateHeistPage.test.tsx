import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getDocs,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import CreateHeistPage from "@/app/(dashboard)/heists/create/page";

const mockPush = vi.fn();

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    collection: vi.fn(),
    serverTimestamp: vi.fn(() => ({ _type: "serverTimestamp" })),
  };
});

vi.mock("@/lib/firebase", () => ({ db: {} }));

vi.mock("@/hooks/useUser", () => ({
  useUser: () => ({
    user: { uid: "user-1", displayName: "SilentFox" },
    loading: false,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockAgents = [
  { id: "agent-1", data: () => ({ codename: "GhostByte" }) },
  { id: "agent-2", data: () => ({ codename: "IronWolf" }) },
];

describe("CreateHeistPage", () => {
  beforeEach(() => {
    vi.mocked(getDocs).mockResolvedValue({ docs: mockAgents } as never);
    vi.mocked(addDoc).mockReset();
    vi.mocked(addDoc).mockResolvedValue({ id: "new-heist-id" } as never);
    vi.mocked(collection).mockReturnValue({
      withConverter: vi.fn().mockReturnValue({}),
    } as never);
    mockPush.mockReset();
  });

  it("renders title, description, assign-to fields and submit button", async () => {
    render(<CreateHeistPage />);

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Assign To")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Heist" }),
    ).toBeInTheDocument();
  });

  it("populates the Assign To dropdown with agents from Firestore", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "GhostByte" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "IronWolf" }),
      ).toBeInTheDocument();
    });
  });

  it("disables submit button while submitting", async () => {
    let resolve!: () => void;
    vi.mocked(addDoc).mockReturnValue(
      new Promise((res) => {
        resolve = () => res({ id: "x" } as never);
      }),
    );

    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByRole("option", { name: "GhostByte" }));

    await user.type(screen.getByLabelText("Title"), "Test Heist");
    await user.type(screen.getByLabelText("Description"), "A test description");
    await user.selectOptions(screen.getByLabelText("Assign To"), "agent-1");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    expect(screen.getByRole("button", { name: "Creating…" })).toBeDisabled();

    resolve();
  });

  it("calls addDoc with the correct payload on valid submit", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByRole("option", { name: "GhostByte" }));

    await user.type(screen.getByLabelText("Title"), "Steal the Stapler");
    await user.type(
      screen.getByLabelText("Description"),
      "Grab it from desk 4B.",
    );
    await user.selectOptions(screen.getByLabelText("Assign To"), "agent-1");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    await waitFor(() => expect(addDoc).toHaveBeenCalled());

    const payload = vi.mocked(addDoc).mock.calls[0][1] as Record<
      string,
      unknown
    >;
    expect(payload.title).toBe("Steal the Stapler");
    expect(payload.description).toBe("Grab it from desk 4B.");
    expect(payload.createdBy).toBe("user-1");
    expect(payload.createdByCodename).toBe("SilentFox");
    expect(payload.assignedTo).toBe("agent-1");
    expect(payload.assignedToCodename).toBe("GhostByte");
    expect(payload.finalStatus).toBeNull();
    expect(payload.deadline).toBeInstanceOf(Date);
  });

  it("redirects to /heists after successful submission", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByRole("option", { name: "GhostByte" }));

    await user.type(screen.getByLabelText("Title"), "Test Heist");
    await user.type(screen.getByLabelText("Description"), "Description here.");
    await user.selectOptions(screen.getByLabelText("Assign To"), "agent-1");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/heists"));
  });

  it("shows error message when addDoc rejects", async () => {
    vi.mocked(addDoc).mockRejectedValue(new Error("Firestore unavailable"));

    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByRole("option", { name: "GhostByte" }));

    await user.type(screen.getByLabelText("Title"), "Fail Heist");
    await user.type(screen.getByLabelText("Description"), "This will fail.");
    await user.selectOptions(screen.getByLabelText("Assign To"), "agent-1");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Firestore unavailable",
      ),
    );
  });

  it("renders a Cancel link pointing to /heists", () => {
    render(<CreateHeistPage />);

    const cancelLink = screen.getByRole("link", { name: "Cancel" });
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink).toHaveAttribute("href", "/heists");
  });
});
