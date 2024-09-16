import React, { useState as useStateReact } from "react";

function MyComponent() {
  const [name] = useStateReact();
  return <>Hello there, {name}</>;
}
