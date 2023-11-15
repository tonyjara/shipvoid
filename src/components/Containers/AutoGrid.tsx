import React from "react";

const AutoGrid = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default AutoGrid;
