import React, { useState } from 'react';
import type { JSX } from 'react';

function MyComponent(): JSX.Element {
  const [name] = useState();
  return <>Hello there, {name}</>;
}
