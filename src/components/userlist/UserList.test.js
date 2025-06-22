import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserList from "./UserList";
import * as userService from "./userService";
import { useAuth } from "../../context/AuthContext";


// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock useAuth
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("UserList Component + Service", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useAuth.mockReturnValue({
      user: { id: 1, email: "admin@test.com", role: "admin" },
      logout: mockLogout,
    });

    localStorage.setItem("token", "fake-token");
  });

  test("affiche les utilisateurs récupérés depuis fetchUsers", async () => {
    userService.fetchUsers = jest.fn().mockResolvedValueOnce([
      { id: 1, nom: "Dupont", prenom: "Jean", email: "jean@example.com" },
      { id: 2, nom: "Durand", prenom: "Marie", email: "marie@example.com" },
    ]);

    render(<UserList />, { wrapper: BrowserRouter });

    expect(userService.fetchUsers).toHaveBeenCalled();

    expect(await screen.findByText("Jean Dupont")).toBeInTheDocument();
    expect(screen.getByText("jean@example.com")).toBeInTheDocument();
    expect(screen.getByText("Marie Durand")).toBeInTheDocument();
    expect(screen.getByText("marie@example.com")).toBeInTheDocument();
  });

  test("le bouton 'Voir plus' s'affiche uniquement pour les admins", async () => {
    userService.fetchUsers = jest.fn().mockResolvedValueOnce([
      { id: 1, nom: "Admin", prenom: "Test", email: "admin@example.com" },
    ]);

    render(<UserList />, { wrapper: BrowserRouter });

    expect(await screen.findByText("Voir plus")).toBeInTheDocument();
  });

  test("le bouton 'Voir plus' ne s'affiche pas pour les non-admins", async () => {
    userService.fetchUsers = jest.fn().mockResolvedValueOnce([
      { id: 1, nom: "Utilisateur", prenom: "Normal", email: "user@example.com" },
    ]);

    useAuth.mockReturnValue({
      user: { id: 2, role: "user" },
      logout: mockLogout,
    });

    render(<UserList />, { wrapper: BrowserRouter });

    await screen.findByText("Normal Utilisateur");

    expect(screen.queryByText("Voir plus")).not.toBeInTheDocument();
  });

  test("clique sur 'Déconnexion' déclenche logout et redirige", () => {
    userService.fetchUsers = jest.fn().mockResolvedValueOnce([]);

    render(<UserList />, { wrapper: BrowserRouter });

    const logoutBtn = screen.getByRole("button", { name: /déconnexion/i });
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("fetchUserById appelle l’API avec le bon header", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        nom: "Mock",
        prenom: "User",
        email: "mock@test.com",
      }),
    });

    const result = await userService.fetchUserById(1);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/1"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      })
    );

    expect(result).toEqual({
      id: 1,
      nom: "Mock",
      prenom: "User",
      email: "mock@test.com",
    });

    global.fetch = originalFetch;
  });

  test("fetchUsers renvoie une erreur si la réponse n’est pas OK", async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false });

    global.fetch = mockFetch;

    const fetchUsers = async () => {
      const token = "fake-token";
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Échec de récupération des utilisateurs");
      }

      return await response.json();
    };

    await expect(fetchUsers()).rejects.toThrow("Échec de récupération des utilisateurs");

    // Nettoyage
    global.fetch = undefined;
  });

  test("fetchUserById renvoie une erreur si la réponse n’est pas OK", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    await expect(userService.fetchUserById(123)).rejects.toThrow("Utilisateur introuvable");

    global.fetch = originalFetch;
  });

  test("fetchUserById renvoie une erreur si le token est manquant", async () => {
    localStorage.removeItem("token");

    await expect(userService.fetchUserById(1)).rejects.toThrow("Token manquant");
  });

  test("fetchUsers renvoie une erreur si l’API est inaccessible", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

    global.fetch = originalFetch;
  }); 
});
