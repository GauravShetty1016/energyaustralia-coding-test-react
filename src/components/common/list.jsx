import React from "react";

const List = ({ listData, children, ulClass, liClass, ...rest }) => {
  return (
    <ul className={ulClass} {...rest}>
      {listData.map((list, index) => {
        return (
          <li className={liClass} key={list.key || index}>
            {children({ listData: list })}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
