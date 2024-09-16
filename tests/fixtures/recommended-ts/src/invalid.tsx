import React, { useState, JSX } from "react";

function MyComponent(): JSX.Element {
  const [name] = useState();
  return <>Hello there, {name}</>;
}
