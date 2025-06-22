import { render, act, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const TestComponent = () => {
    const { user, login, logout, isAuthenticated } = useAuth();

    return (
        <div>
            <p data-testid="user">{user ? user.email : "null"}</p>
            <p data-testid="auth">{isAuthenticated ? "true" : "false"}</p>
            <button onClick={() => login({ id: 1, email: "test@test.com", role: "admin" }, "fake-token")}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("charge le user depuis le localStorage", async () => {
        const storedUser = { id: 2, email: "stored@test.com", role: "admin" };
        localStorage.setItem("user", JSON.stringify(storedUser));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId("user").textContent).toBe("stored@test.com");
        expect(screen.getByTestId("auth").textContent).toBe("true");
    });

    test("login et logout mettent à jour le localStorage et le state", async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText("Login").click();
        });

        expect(localStorage.getItem("token")).toBe("fake-token");
        expect(JSON.parse(localStorage.getItem("user")).email).toBe("test@test.com");

        expect(screen.getByTestId("user")).toHaveTextContent("test@test.com");
        expect(screen.getByTestId("auth")).toHaveTextContent("true");

        await act(async () => {
            screen.getByText("Logout").click();
        });

        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
        expect(screen.getByTestId("user")).toHaveTextContent("null");
        expect(screen.getByTestId("auth")).toHaveTextContent("false");
    });
});
