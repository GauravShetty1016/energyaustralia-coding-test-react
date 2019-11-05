import React from "react";
import List from "../common/list";
import ErrorPage from "../common/errorPage";

const RecordLabelList = props => {
  if (props.error) return <ErrorPage error={props.error}></ErrorPage>;

  const displayClass = { ulClass: "list", liClass: "node" };
  return <List listData={props.recordLabels} displayClass={displayClass}></List>;
};

export default RecordLabelList;
