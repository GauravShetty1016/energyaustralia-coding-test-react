import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import ErrorPage from "../../../components/common/errorPage";
import List from "../../../components/common/list";
import RecordLabelList from "../../../components/RecordLabelList";

afterEach(cleanup);

describe("Record Labels List", () => {
  describe("When there is an error", () => {
    it("Renders the error page", function() {
      const recordLabels = [];
      const error = { error: { status: 429, message: "Throttled" } };
      const response = render(<RecordLabelList recordLabels={recordLabels} error={error}></RecordLabelList>);
      const expectedResponse = render(<ErrorPage error={error}></ErrorPage>);
      expect(response.baseHtml).toBe(expectedResponse.baseHtml);
    });
  });

  describe("When the data correct", () => {
    it("renders the correct list when the data is correct", () => {
      const displayClass = { ulClass: "list", liClass: "node" };
      const recordLabels = [
        {
          name: "Fourth Woman Records",
          type: "recordLabel",
          nodes: [
            { name: "Jill Black", type: "band", nodes: [] },
            { name: "The Black Dashes", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }
          ]
        }
      ];
      const error = null;
      const response = render(<RecordLabelList recordLabels={recordLabels} error={error}></RecordLabelList>);
      const expectedResponse = render(<List listData={recordLabels} displayClass={displayClass}></List>);
      expect(response.baseHtml).toBe(expectedResponse.baseHtml);
    });
  });
});
