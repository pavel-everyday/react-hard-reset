import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HardReset } from 'react-hard-reset'

const CounterByTwo = ({ startNumber }: { startNumber: number }) => {
  const [state, setState] = useState(startNumber)

  return (
    <>
      <h4>counter by two</h4>
      <span>init state: {startNumber}</span>
      <br />
      <span>startNumber prop: {startNumber}</span>
      <br />
      <span>current state: {state}</span>
      <br />
      <br />
      <button onClick={() => setState(state + 2)}>
        <strong>add +2</strong>
      </button>
    </>
  )
}

const OddEvenCounter = () => {
  const [startNumber, setStartNumber] = useState(1)

  const toggleMode = () => {
    if (startNumber === 1) {
      setStartNumber(2)
    } else {
      setStartNumber(1)
    }
  }

  return (
    <>
      <button onClick={toggleMode}>switch mode</button>
      <h3>counter by two with HardReset wrapper - can reset the inner state</h3>
      {/* // when mode is changed, the state of CounterByTwo will be reset */}
      <HardReset dependency={[startNumber]}>
        <CounterByTwo startNumber={startNumber} />
      </HardReset>
      <h3>counter by two without HardReset wrapper - can not reset the inner state</h3>
      <CounterByTwo startNumber={startNumber} />
    </>
  )
}

const App = () => (
  <>
    <h1>react-hard-reset example</h1>
    <desc>
      You can see counter by two.
      <br /> This counter has <strong>inner state</strong>.
      <br /> If you want count even numbers you need to reset starter number to 2
      <br /> You can reset inner state easy with react-hard-reset
      <br /> <code>startNumber</code> is inside the <code>dependency</code> prop.
      <br /> If you change <code>startNumber</code> the state of <code>CounterByTwo</code> will be reset with new{' '}
      <code>startNumber</code> prop.
      <br />
      <pre>
        {`
        <HardReset dependency={[startNumber]}>
              <CounterByTwo startNumber={startNumber} />
        </HardReset>
      `}
      </pre>
    </desc>
    <hr />
    <OddEvenCounter />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
