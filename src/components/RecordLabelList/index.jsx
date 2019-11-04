import React from "react";
import List from "../common/list";
import ErrorPage from "../common/errorPage";

const festivalsList = festival => {
  return <div className="name">{festival}</div>;
};

const bandsList = band => {
  return (
    <React.Fragment>
      <div className="name">{band.name}</div>
      <List listData={band.festivals} ulClass="festivals-list" liClass="festival-entry">
        {festivalsList}
      </List>
    </React.Fragment>
  );
};

const recordLabelList = recordLabel => {
  return (
    <React.Fragment>
      <div className="name">{recordLabel.name}</div>;
      <List listData={recordLabel.bands} ulClass="bands-list" liClass="band-entry">
        {bandsList}
      </List>
    </React.Fragment>
  );
};

const RecordLabelList = props => {
  if (props.error) return <ErrorPage error={props.error}></ErrorPage>;
  return (
    <List listData={props.recordLabels} ulClass="record-labels-list" liClass="record-label-entry">
      {recordLabelList}
    </List>
  );
};

export default RecordLabelList;
