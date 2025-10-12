import React, { useState } from "react";
export function Tabs({ children, defaultValue, ...props }) {
  const [active, setActive] = useState(defaultValue);
  return <div {...props}>{children}</div>;
}
export function TabsList({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
export function TabsTrigger({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

