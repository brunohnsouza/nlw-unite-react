import * as React from "react";
import { JSX } from "react/jsx-runtime";

function Arrow(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.516 6L7 11.201 1.484 6 0 7.4 7 14l7-6.6L12.516 6z"
        fill="#8D8D99"
      />
      <path
        d="M12.516 0L7 5.201 1.484 0 0 1.4 7 8l7-6.6L12.516 0z"
        fill="#8D8D99"
      />
    </svg>
  );
}

export default Arrow;
