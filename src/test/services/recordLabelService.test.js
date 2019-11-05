import moxios from "moxios";
import RecordLabelService from "../../services/recordLabelService";
import _ from "lodash";

describe("Record Label Services", () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it("Should have a function", () => {
    expect(RecordLabelService.getRecordLabels).toBeInstanceOf(Function);
  });

  describe("Test error handling", () => {
    it("Should send a custom error for 429 error", async () => {
      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.reject({
          response: { status: 429, error: "Throttled" }
        });
      });

      const response = await RecordLabelService.getRecordLabels();

      expect(response).toBeDefined();
      expect(response).toHaveProperty("error");
      expect(response).toHaveProperty("error.status", 429);
      expect(response).toHaveProperty("error.message", "The request has been throttled");
    });

    it("Should send a custom error for 404 not found", async () => {
      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.reject({
          response: { status: 404, error: "Not Found" }
        });
      });

      const response = await RecordLabelService.getRecordLabels();

      expect(response).toBeDefined();
      expect(response).toHaveProperty("error");
      expect(response).toHaveProperty("error.status", 404);
      expect(response).toHaveProperty("error.message", "Invalid Request. Data not found");
    });

    it("Should be able to handle a network error", async () => {
      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.reject({ message: "Unexpected Error" });
      });

      const response = await RecordLabelService.getRecordLabels();

      expect(response).toBeDefined();
      expect(response).toHaveProperty("error");
      expect(response).toHaveProperty("error.status", 500);
      expect(response).toHaveProperty("error.message", "Unexpected Error");
    });
  });

  describe("Testing structure of the returned data when the server returns an array of data", () => {
    beforeEach(() => {
      const festivalData = [
        {
          name: "LOL-palooza",
          bands: [
            { name: "Jill Black", recordLabel: "Fourth Woman Records" },
            { name: "Werewolf Weekday", recordLabel: "XS Recordings" },
            { name: "Winter Primates", recordLabel: "" },
            { name: "Frank Jupiter", recordLabel: "Pacific Records" }
          ]
        },
        {
          name: "Small Night In",
          bands: [
            { name: "Wild Antelope", recordLabel: "Marner Sis. Recording" },
            { name: "Squint-281", recordLabel: "Outerscope" },
            { name: "The Black Dashes", recordLabel: "Fourth Woman Records" },
            { name: "Green Mild Cold Capsicum", recordLabel: "Marner Sis. Recording" },
            { name: "Yanke East", recordLabel: "MEDIOCRE Music" }
          ]
        }
      ];

      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: festivalData
        });
      });
    });

    it("Should have the correct keys", async () => {
      const response = await RecordLabelService.getRecordLabels();
      const record = response.recordLabels[0];

      expect(response.recordLabels).toHaveLength(7);
      expect(record).toHaveProperty("name");
      expect(record).toHaveProperty("nodes");
      expect(record).toHaveProperty("type", "recordLabel");
      expect(record.nodes).toBeInstanceOf(Array);
      expect(record).toHaveProperty(["nodes", 0, "name"]);
      expect(record).toHaveProperty(["nodes", 0, "type"], "band");
      expect(record).toHaveProperty(["nodes", 0, "nodes"]);
      expect(record.nodes[0].nodes).toBeInstanceOf(Array);
      expect(record).toHaveProperty(["nodes", 0, "nodes", 0, "name"]);
      expect(record).toHaveProperty(["nodes", 0, "nodes", 0, "type"], "festival");
    });

    it("Should have record labels as the top value", async () => {
      const { recordLabels } = await RecordLabelService.getRecordLabels();
      const expected = [
        {
          name: "Fourth Woman Records",
          type: "recordLabel",
          nodes: [
            { name: "Jill Black", type: "band", nodes: [{ type: "festival", name: "LOL-palooza" }] },
            { name: "The Black Dashes", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }
          ]
        },
        {
          name: "MEDIOCRE Music",
          type: "recordLabel",
          nodes: [{ name: "Yanke East", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }]
        },
        {
          name: "Marner Sis. Recording",
          type: "recordLabel",
          nodes: [
            { name: "Green Mild Cold Capsicum", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] },
            { name: "Wild Antelope", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }
          ]
        },
        {
          name: "No Record Label",
          type: "recordLabel",
          nodes: [{ name: "Winter Primates", type: "band", nodes: [{ type: "festival", name: "LOL-palooza" }] }]
        },
        {
          name: "Outerscope",
          type: "recordLabel",
          nodes: [{ name: "Squint-281", type: "band", nodes: [{ type: "festival", name: "Small Night In" }] }]
        },
        {
          name: "Pacific Records",
          type: "recordLabel",
          nodes: [{ name: "Frank Jupiter", type: "band", nodes: [{ type: "festival", name: "LOL-palooza" }] }]
        },
        {
          name: "XS Recordings",
          type: "recordLabel",
          nodes: [{ name: "Werewolf Weekday", type: "band", nodes: [{ type: "festival", name: "LOL-palooza" }] }]
        }
      ];

      expect(recordLabels).toEqual(expected);
    });

    it("Should classify bands with no label under 'No Record Label'", async () => {
      const { recordLabels } = await RecordLabelService.getRecordLabels();
      const otherEntry = _.filter(recordLabels, { name: "No Record Label" });

      expect(otherEntry).toHaveLength(1);
      expect(otherEntry[0]).toHaveProperty("name", "No Record Label");
      expect(otherEntry[0]).toHaveProperty(["nodes", 0, "name"], "Winter Primates");
    });
  });

  describe("Testing the structure of the data when the server returns a blank string or no data", () => {
    it("Should handle a blank array of data", async () => {
      const festivalData = [];

      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: festivalData
        });
      });

      const response = await RecordLabelService.getRecordLabels();
      expect(response).toHaveProperty("recordLabels");
      expect(response.recordLabels).toHaveLength(0);
      expect(response.recordLabels).toBeInstanceOf(Array);
    });

    it("Should handle a blank string", async () => {
      const festivalData = "";

      moxios.wait(function() {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: festivalData
        });
      });

      const response = await RecordLabelService.getRecordLabels();
      expect(response).toHaveProperty("recordLabels");
      expect(response.recordLabels).toHaveLength(0);
      expect(response.recordLabels).toBeInstanceOf(Array);
    });
  });
});
