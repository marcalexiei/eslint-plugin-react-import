import * as React from 'react';

function MyComponent(): React.JSX.Element {
  const [name] = React.useState();
  return <>Hello there, {name}</>;
}
