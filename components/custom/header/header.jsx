import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TBLHeader = ({ headers, onSorting }) => {
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");
  const role = JSON.parse(localStorage.getItem("user"))?.payload?.admin.role.roleName;
  const path = window.location.pathname;
  const onSortingChange = (field) => {
    const order =
      field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };


  return (
    <thead>
      <tr>
        {headers.map(({ name, field, sortable }) =>
         ((path === "/menu/menu" || path === "/menu/question/question") && field === "Action") && role !== "superadmin"  ? null : (
            <th
              key={name}
              onClick={() => (sortable ? onSortingChange(field) : null)}
            >
              {name}

              {sortingField && sortingField === field && <></>}
            </th>
          )
        )}
      </tr>
    </thead>
  );
};

export default TBLHeader;
