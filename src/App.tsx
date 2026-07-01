import { useState } from 'react'
import { Button, Popover } from "@blueprintjs/core";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Popover
      content={
        <div>
          <h5>Popover Title</h5>
        </div>
      }
      interactionKind="hover"
    >
      <Button onClick={() => setCount(count + 1)}>Clicked: {count}</Button>
    </Popover>
  )
}

export default App
