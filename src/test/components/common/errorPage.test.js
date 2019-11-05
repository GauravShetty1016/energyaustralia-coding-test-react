import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import ErrorPage from "../../../components/common/errorPage";

afterEach(cleanup);

it("Renders the error information", () => {
  const error = { status: 404, message: "Page Not Found" };
  const { queryByText } = render(<ErrorPage error={error} />);

  expect(queryByText("An error has been encountered")).toBeInTheDocument();
  expect(queryByText("Status: 404")).toBeInTheDocument();
  expect(queryByText("Message: Page Not Found")).toBeInTheDocument();
});

it("Renders the when error information is blank", () => {
  const error = {};
  const { queryByText } = render(<ErrorPage error={error} />);

  expect(queryByText("An error has been encountered")).toBeInTheDocument();
  expect(queryByText("Status:")).toBeInTheDocument();
  expect(queryByText("Message:")).toBeInTheDocument();
});

it("Renders the when error information is null", () => {
  const error = null;
  const { queryByText } = render(<ErrorPage error={error} />);

  expect(queryByText("An error has been encountered")).toBeInTheDocument();
  expect(queryByText("Status:")).toBeInTheDocument();
  expect(queryByText("Message:")).toBeInTheDocument();
});
