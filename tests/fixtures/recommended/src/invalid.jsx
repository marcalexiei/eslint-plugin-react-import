import React, { useState } from "react";

function MyComponent() {
  const [name] = useState();
  return <>Hello there, {name}</>;
}
