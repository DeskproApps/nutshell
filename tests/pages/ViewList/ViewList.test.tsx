import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { ViewList } from "../../../src/pages/ViewList/ViewList";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ViewList />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    ...jest.requireActual("../../../src/api/api"),
    getContactById: () => ({
      result: {
        id: 1,
        name: {
          displayName: "Michael Something",
        },
        description: "This is a contact description",
        email: "email@email.com",
        phone: "123456789",
        account: "Company",
        owner: {
          name: "John Doe",
        },
        leads: [],
        notes: [],
      },
    }),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({
    objectName: "contact",
    objectId: "1",
  }),
}));

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const AssigneeName = await waitFor(() => getByText(/John Doe/i));

    const address = await waitFor(() => getByText(/123 Main Street/i));

    const tag = await waitFor(() => getByText(/Test tag/i));

    await waitFor(() => {
      [AssigneeName, address, tag].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
