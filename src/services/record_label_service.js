import FestivalService from "./festival_service";
import _ from "lodash";

const getSortedRecordsFromFestivals = (festivals, order = "asc") => {
  let recordLabels = {};
  let bands = {};
  let recordData = [];

  if (_.isEmpty(festivals)) return [];

  _.forEach(festivals, festival => {
    _.forEach(festival.bands, band => {
      if (!festival.name) return false;
      const label = _.isEmpty(band.recordLabel) ? "No Record Label" : band.recordLabel.trim();
      recordLabels[label] = recordLabels[label] || { bands: {} };
      bands[band.name] = _.isEmpty(bands[band.name])
        ? [{ name: festival.name, type: "festival" }]
        : !_.includes(bands[band.name], festival.name)
        ? [...bands[band.name], { name: festival.name }]
        : bands[band.name];
      recordLabels[label].bands[band.name] = bands[band.name];
    });
  });

  recordData = _.reduce(
    recordLabels,
    (data, { bands }, name) => {
      const bandData = _.reduce(
        bands,
        (data, festivals, name) => {
          data.push({ name, nodes: _.orderBy(festivals, "name", order), type: "band" });
          return data;
        },
        []
      );
      data.push({ name, nodes: _.orderBy(bandData, "name", order), type: "recordLabel" });
      return data;
    },
    []
  );

  return _.orderBy(recordData, "name", order);
};

const errorHandler = error => {
  if (!error.response) return { error: { status: 500, message: error.message } };

  let message = "Unknown error";
  const {
    response: { status }
  } = error;
  if (status === 429) message = "The request has been throttled";
  if (status === 404) message = "Invalid Request. Data not found";
  return { error: { status, message } };
};

async function getRecordLabels() {
  try {
    const festivals = await FestivalService.getFestivals();
    return { recordLabels: getSortedRecordsFromFestivals(festivals.data) };
  } catch (error) {
    return errorHandler(error);
  }
}

export default { getRecordLabels };
