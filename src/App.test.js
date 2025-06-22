import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./components/registration/Registration", () => () => <div>Page d'inscription</div>);
jest.mock("./components/userlist/UserList", () => () => <div>Liste des utilisateurs</div>);
jest.mock("./components/login/Login", () => () => <div>Page de login</div>);
jest.mock("./components/details/Details", () => () => <div>Détails utilisateur</div>);

jest.mock("./pages/Home", () => ({ children }) => <div>{children}</div>);

jest.mock("./routes/RequiredAuth", () => ({ children }) => <>{children}</>);

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => <>{children}</>,
  };
});

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation((msg) => {
    if (
      msg.includes("React Router Future Flag Warning") ||
      msg.includes('No routes matched location')
    ) return;
    console.warn(msg);
  });
});

describe("App routing", () => {
  test("affiche la liste des utilisateurs sur /users", () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Liste des utilisateurs")).toBeInTheDocument();
  });

  test("n'affiche rien si la route est inconnue", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.queryByText("Page d'inscription")).not.toBeInTheDocument();
    expect(screen.queryByText("Liste des utilisateurs")).not.toBeInTheDocument();
    expect(screen.queryByText("Page de login")).not.toBeInTheDocument();
  });
});
