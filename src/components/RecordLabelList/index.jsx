import React from "react";
import List from "../common/list";
import ErrorPage from "../common/errorPage";

const RecordLabelList = ({ error, recordLabels }) => {
  if (error) return <ErrorPage error={error}></ErrorPage>;

  const displayClass = { ulClass: "list", liClass: "node" };
  return <List listData={recordLabels} displayClass={displayClass}></List>;
};

export default RecordLabelList;
