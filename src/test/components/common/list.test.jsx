import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import List from "../../../components/common/list";

afterEach(cleanup);

describe("Nested List component gets correct data", () => {
  describe("List gets nested data", () => {
    const data = [
      {
        name: "Fourth Woman Records",
        type: "recordLabel",
        nodes: [
          { name: "Jill Black", type: "band", nodes: [{ type: "festival", name: "LOL-palooza" }] },
          { name: "The Black Dashes", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }
        ]
      }
    ];
    const displayClass = { ulClass: "testUl", liClass: "testLi" };

    it("Renders all the data in the list", () => {
      const { queryByText } = render(<List listData={data} displayClass={displayClass}></List>);
      expect(queryByText("Fourth Woman Records")).toBeInTheDocument();
      expect(queryByText("Jill Black")).toBeInTheDocument();
      expect(queryByText("LOL-palooza")).toBeInTheDocument();
      expect(queryByText("The Black Dashes")).toBeInTheDocument();
      expect(queryByText("Small Night In")).toBeInTheDocument();
    });

    it("Renders the all the provided data", () => {
      const { queryAllByRole } = render(<List listData={data} displayClass={displayClass}></List>);

      expect(queryAllByRole("band")).toHaveLength(2);
      expect(queryAllByRole("festival")).toHaveLength(2);
      expect(queryAllByRole("recordLabel")).toHaveLength(1);
    });
  });

  describe("List gets empty array", () => {
    it("Renders a message saying the list is empty", () => {
      const data = [];
      const displayClass = { ulClass: "testUl", liClass: "testLi" };
      const { queryByText } = render(<List listData={data} displayClass={displayClass}></List>);
      expect(queryByText("The List is empty")).toBeInTheDocument();
    });
  });

  describe("List gets nested data with missing nodes at different levels", () => {
    const data = [
      {
        name: "Fourth Woman Records",
        type: "recordLabel",
        nodes: [
          { name: "Jill Black", type: "band" },
          { name: "The Black Dashes", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }
        ]
      }
    ];
    const displayClass = { ulClass: "testUl", liClass: "testLi" };

    it("Renders all the data in the list", () => {
      const { queryByText } = render(<List listData={data} displayClass={displayClass}></List>);
      expect(queryByText("Fourth Woman Records")).toBeInTheDocument();
      expect(queryByText("Jill Black")).toBeInTheDocument();
      expect(queryByText("The Black Dashes")).toBeInTheDocument();
      expect(queryByText("Small Night In")).toBeInTheDocument();
    });

    it("Renders the all the provided data", () => {
      const { queryAllByRole } = render(<List listData={data} displayClass={displayClass}></List>);

      expect(queryAllByRole("band")).toHaveLength(2);
      expect(queryAllByRole("festival")).toHaveLength(1);
      expect(queryAllByRole("recordLabel")).toHaveLength(1);
    });
  });

  describe("List gets nested data with empty node", () => {
    const data = [
      {
        name: "Fourth Woman Records",
        type: "recordLabel",
        nodes: [
          { name: "Jill Black", type: "band", nodes: [] },
          { name: "The Black Dashes", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }
        ]
      }
    ];
    const displayClass = { ulClass: "testUl", liClass: "testLi" };

    it("Renders all the data in the list", () => {
      const { queryByText } = render(<List listData={data} displayClass={displayClass}></List>);
      expect(queryByText("Fourth Woman Records")).toBeInTheDocument();
      expect(queryByText("Jill Black")).toBeInTheDocument();
      expect(queryByText("The Black Dashes")).toBeInTheDocument();
      expect(queryByText("Small Night In")).toBeInTheDocument();
      expect(queryByText("The List is empty")).toBeNull();
    });

    it("Renders the all the provided data", () => {
      const { queryAllByRole } = render(<List listData={data} displayClass={displayClass}></List>);

      expect(queryAllByRole("band")).toHaveLength(2);
      expect(queryAllByRole("festival")).toHaveLength(1);
      expect(queryAllByRole("recordLabel")).toHaveLength(1);
    });
  });
});
