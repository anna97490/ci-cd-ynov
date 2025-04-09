import React from "react";
import { render, screen } from "@testing-library/react";
import UserList from "./UserList";

describe("UserList", () => {
  const mockUsers = [
    {
      nom: "Dupont",
      prenom: "Jean",
      ville: "Paris",
      codePostal: "75001",
    },
    {
      nom: "Durand",
      prenom: "Claire",
      ville: "Lyon",
      codePostal: "69000",
    },
  ];

  test("affiche le titre", () => {
    render(<UserList users={mockUsers} />);
    expect(screen.getByText("Liste des inscrits")).toBeInTheDocument();
  });

  test("affiche tous les utilisateurs", () => {
    render(<UserList users={mockUsers} />);
    
    expect(screen.getByText("Jean Dupont – Paris (75001)")).toBeInTheDocument();
    expect(screen.getByText("Claire Durand – Lyon (69000)")).toBeInTheDocument();
  });

  test("affiche une liste vide sans erreur si aucun utilisateur", () => {
    render(<UserList users={[]} />);
    const items = screen.queryAllByRole("listitem");
    expect(items.length).toBe(0);
  });
});
