import React from "react";
import { ReactComponent as EllipseSvg } from "../../images/icon_ellipsis.svg";
import "./loadIcon.css";

export default function LoadIcon(props) {
  return (
    <span className={`ellipsis ${props.theme ? props.theme : ""}`}>
      <EllipseSvg />
    </span>
  );
}
