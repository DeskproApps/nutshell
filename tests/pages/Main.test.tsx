import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/api/api", () => {
  return {
    ...jest.requireActual("../../src/api/api"),
    getContactByEmail: () => ({
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
    getActivitiesByContactId: () => ({
      result: [
        {
          date: "2021-05-05",
          name: "This is an activity",
        },
      ],
    }),
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const AssigneeName = await waitFor(() => getByText(/John Doe/i));

    const activity = await waitFor(() => getByText(/This is an activity/i));

    await waitFor(() => {
      [AssigneeName, activity].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
