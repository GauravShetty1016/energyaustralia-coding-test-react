import React from "react";
import _ from "lodash";

const List = ({ listData, displayClass, ...rest }) => {
  const { nameClass, ulClass, liClass } = displayClass;

  if (_.isEmpty(listData)) return <div>The List is empty</div>;
  return (
    <ul className={ulClass} {...rest}>
      {listData.map((list, index) => {
        const hasNodes = !_.isEmpty(list.nodes);
        return (
          <li className={liClass} role={list.type} key={list.key || index}>
            <div className={nameClass}>{list.name}</div>
            {hasNodes && <List displayClass={displayClass} listData={list.nodes}></List>}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
