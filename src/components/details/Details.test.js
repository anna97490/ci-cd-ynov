import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import Details from "./Details";
import * as detailsService from "./detailsService";
import { useAuth } from "../../context/AuthContext";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
}));

// Mock useAuth
jest.mock("../../context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

describe("Details Component + Service", () => {
    const mockUser = { id: 999, email: "admin@test.com", role: "admin" };
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("token", "fake-token");
        useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    });

    afterEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    test("redirige vers /users si aucun utilisateur n'est connecté", () => {
        useAuth.mockReturnValue({ user: null });

        render(
            <MemoryRouter initialEntries={["/users/1"]}>
                <Routes>
                    <Route path="/users/:id" element={<Details />} />
                </Routes>
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/users");
    });

    test("affiche une alerte si fetchUserById échoue", async () => {
        jest.spyOn(detailsService, "fetchUserById").mockRejectedValue(new Error("Erreur réseau"));
        window.alert = jest.fn();

        render(
            <MemoryRouter initialEntries={["/users/1"]}>
                <Routes>
                    <Route path="/users/:id" element={<Details />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Erreur : Erreur réseau");
        });
    });

    test("affiche les détails de l'utilisateur si admin", async () => {
        const userMock = {
            id: 1,
            nom: "Doe",
            prenom: "John",
            email: "john@example.com",
            ville: "Paris",
            codePostal: "75000",
            dateNaissance: "1990-01-01"
        };

        jest.spyOn(detailsService, "fetchUserById").mockResolvedValue(userMock);

        render(
            <MemoryRouter initialEntries={["/users/1"]}>
                <Routes>
                    <Route path="/users/:id" element={<Details />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/Détails de l'utilisateur/i)).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    test("redirige vers /users si non-admin", async () => {
        useAuth.mockReturnValue({ user: { id: 2, role: "user" }, logout: mockLogout });

        render(
            <MemoryRouter initialEntries={["/users/1"]}>
                <Routes>
                    <Route path="/users/:id" element={<Details />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/users");
        });
    });

    test("supprime l'utilisateur après confirmation", async () => {
        jest.useFakeTimers();

        jest.spyOn(detailsService, "fetchUserById").mockResolvedValue({
            id: 1,
            nom: "Test",
            prenom: "User",
            email: "test@user.com",
            ville: "",
            codePostal: "",
            dateNaissance: ""
        });

        jest.spyOn(detailsService, "deleteUserById").mockResolvedValue({ success: true });

        window.confirm = jest.fn(() => true);

        render(
            <MemoryRouter initialEntries={["/users/1"]}>
                <Routes>
                    <Route path="/users/:id" element={<Details />} />
                </Routes>
            </MemoryRouter>
        );

        const deleteBtn = await screen.findByText(/supprimer cet utilisateur/i);
        fireEvent.click(deleteBtn);

        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(detailsService.deleteUserById).toHaveBeenCalledWith("1");
        });

        jest.useRealTimers();
    });

    test("fetchUserById - appel correct et retour JSON", async () => {
        localStorage.setItem("token", "fake-token");

        const originalFetch = global.fetch; // sauvegarde
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, nom: "Test" }),
        });

        const result = await detailsService.fetchUserById(1);

        global.fetch = originalFetch;
        localStorage.clear();
    });

    test("deleteUserById - appel correct et retour JSON", async () => {
        localStorage.setItem("token", "fake-token");

        const originalFetch = global.fetch;
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });
        global.fetch = mockFetch;

        const result = await detailsService.deleteUserById(1);

        global.fetch = originalFetch;
        localStorage.clear();
    });

    test("fetchUserById - erreur générique", async () => {
        localStorage.setItem("token", "fake-token");

        const mockFetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({}),
        });
        global.fetch = mockFetch;

        const result = detailsService.fetchUserById(1); 

        global.fetch = undefined;
        localStorage.clear();
    });

    test("deleteUserById - erreur générique", async () => {
        localStorage.setItem("token", "fake-token");

        const mockFetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({}),
        });
        global.fetch = mockFetch;

        const resultPromise = detailsService.deleteUserById(1);

        global.fetch = undefined;
        localStorage.clear();
    });

    test("affiche une erreur toast si la suppression échoue", async () => {
        jest.spyOn(detailsService, "fetchUserById").mockResolvedValue({
            id: 1,
            nom: "Test",
            prenom: "User",
            email: "test@user.com",
            ville: "",
            codePostal: "",
            dateNaissance: ""
        });

        jest.spyOn(detailsService, "deleteUserById").mockRejectedValue(new Error("Erreur suppression"));
        window.confirm = jest.fn(() => true);

        render(
            <MemoryRouter initialEntries={["/users/1"]}>
                <Routes>
                    <Route path="/users/:id" element={<Details />} />
                </Routes>
            </MemoryRouter>
        );

        const deleteBtn = await screen.findByText(/supprimer cet utilisateur/i);
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(screen.getByText(/Erreur suppression/i)).toBeInTheDocument();
        });
    });

    test("fetchUserById - erreur 401/403 déclenche exception d'accès refusé", async () => {
        localStorage.setItem("token", "fake-token");

        global.fetch = jest.fn().mockResolvedValue({
            status: 401,
            ok: false,
            json: async () => ({}),
        });
    });

    test("fetchUserById - erreur autre que 401/403 déclenche exception 'Utilisateur introuvable'", async () => {
        localStorage.setItem("token", "fake-token");

        global.fetch = jest.fn().mockResolvedValue({
            status: 404,
            ok: false,
            json: async () => ({}),
        });
    });

    test("deleteUserById - erreur 401/403 déclenche exception d'accès refusé", async () => {
        localStorage.setItem("token", "fake-token");

        global.fetch = jest.fn().mockResolvedValue({
            status: 403,
            ok: false,
            json: async () => ({}),
        });
    });

    test("deleteUserById - erreur autre que 401/403 déclenche exception suppression", async () => {
        localStorage.setItem("token", "fake-token");

        global.fetch = jest.fn().mockResolvedValue({
            status: 500,
            ok: false,
            json: async () => ({}),
        });
    });
});
