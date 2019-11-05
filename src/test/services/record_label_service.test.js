import moxios from "moxios";
import RecordLabelService from "../../services/record_label_service";
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

  describe("Testing structure of the returned data", () => {
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
    // TODO: Update to reflect the fact that its going to be a consistent naming convention.
    it("Should have the correct keys", async () => {
      const response = await RecordLabelService.getRecordLabels();
      const record = response.recordLabels[0];

      expect(response.recordLabels).toHaveLength(7);
      expect(record).toHaveProperty("name");
      expect(record).toHaveProperty("bands");
      expect(record.bands).toBeInstanceOf(Array);
      expect(record).toHaveProperty(["bands", 0, "name"]);
      expect(record).toHaveProperty(["bands", 0, "festivals"]);
      expect(record.bands[0].festivals).toBeInstanceOf(Array);
    });

    it("Should have record labels as the top value", async () => {
      const { recordLabels } = await RecordLabelService.getRecordLabels();
      const expected = [
        {
          name: "Fourth Woman Records",
          bands: [
            { name: "Jill Black", festivals: ["LOL-palooza"] },
            { name: "The Black Dashes", festivals: ["Small Night In"] }
          ]
        },
        { name: "MEDIOCRE Music", bands: [{ name: "Yanke East", festivals: ["Small Night In"] }] },
        {
          name: "Marner Sis. Recording",
          bands: [
            { name: "Green Mild Cold Capsicum", festivals: ["Small Night In"] },
            { name: "Wild Antelope", festivals: ["Small Night In"] }
          ]
        },
        { name: "No Record Label", bands: [{ name: "Winter Primates", festivals: ["LOL-palooza"] }] },
        { name: "Outerscope", bands: [{ name: "Squint-281", festivals: ["Small Night In"] }] },
        { name: "Pacific Records", bands: [{ name: "Frank Jupiter", festivals: ["LOL-palooza"] }] },
        { name: "XS Recordings", bands: [{ name: "Werewolf Weekday", festivals: ["LOL-palooza"] }] }
      ];

      expect(recordLabels).toEqual(expected);
    });

    it("Should classify bands with no label under 'No Record Label'", async () => {
      const { recordLabels } = await RecordLabelService.getRecordLabels();
      const otherEntry = _.filter(recordLabels, { name: "No Record Label" });

      expect(otherEntry).toHaveLength(1);
      expect(otherEntry[0]).toHaveProperty("name", "No Record Label");
      expect(otherEntry[0]).toHaveProperty(["bands", 0, "name"], "Winter Primates");
    });
  });
});
