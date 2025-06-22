import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";

// Composant factice pour simuler un enfant dans <Outlet />
const DummyChild = () => <div data-testid="child">Contenu enfant</div>;

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation((msg) => {
    if (
      msg.includes("React Router Future Flag Warning") ||
      msg.includes("No routes matched location")
    ) return;
    console.warn(msg);
  });
});

describe("Home Component", () => {
  test("affiche le titre et les liens", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();

    const linkInscription = screen.getByText("S’inscrire");
    const linkConnexion = screen.getByText("Se connecter");

    expect(linkInscription).toBeInTheDocument();
    expect(linkInscription.getAttribute("href")).toBe("/");

    expect(linkConnexion).toBeInTheDocument();
    expect(linkConnexion.getAttribute("href")).toBe("/login");
  });

  test("rendu du composant enfant via <Outlet />", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<DummyChild />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child.textContent).toBe("Contenu enfant");
  });
});
