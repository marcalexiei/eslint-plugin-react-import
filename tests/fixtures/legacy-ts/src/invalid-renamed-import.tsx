import React, { useState as useStateReact } from "react";

function MyComponent(): JSX.Element {
  const [name] = useStateReact();
  return <>Hello there, {name}</>;
}
