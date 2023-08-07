import React, { Component, useState } from 'react'
import '@testing-library/jest-dom'
import { act, render } from '@testing-library/react'

import { HardReset } from '../src'

describe('HardReset', () => {
  describe('just render', () => {
    const MOCK_CHILD_CONTENT = 'Child component content'

    const ChildComponent = () => <div>{MOCK_CHILD_CONTENT}</div>

    it('renders child content', () => {
      const { getByText } = render(
        <HardReset dependency={[]}>
          <ChildComponent />
        </HardReset>,
      )

      expect(getByText(MOCK_CHILD_CONTENT)).toBeInTheDocument()
    })

    it('renders children content', () => {
      const { getAllByText } = render(
        <HardReset dependency={[]}>
          <ChildComponent />
          <ChildComponent />
          <ChildComponent />
        </HardReset>,
      )

      expect(getAllByText(MOCK_CHILD_CONTENT).length).toBe(3)
    })
  })

  describe('just render with class component', () => {
    const MOCK_CHILD_CONTENT = 'Child component content'

    class ChildComponent extends Component {
      render() {
        return <div>{MOCK_CHILD_CONTENT}</div>
      }
    }

    it('renders child content', () => {
      const { getByText } = render(
        <HardReset dependency={[]}>
          <ChildComponent />
        </HardReset>,
      )

      expect(getByText(MOCK_CHILD_CONTENT))
    })

    it('renders children content', () => {
      const { getAllByText } = render(
        <HardReset dependency={[]}>
          <ChildComponent />
          <ChildComponent />
          <ChildComponent />
        </HardReset>,
      )

      expect(getAllByText(MOCK_CHILD_CONTENT).length).toBe(3)
    })
  })

  describe('work fine with statefull component', () => {
    it('do not broke state on rerender with FC', () => {
      const MOCK_COUNTER_TITLE = 'Counter'

      const Counter = () => {
        const [state, setState] = useState(0)

        return (
          <>
            <strong>{MOCK_COUNTER_TITLE}</strong>
            <span>{state}</span>
            <button onClick={() => setState(state + 1)}>+</button>
          </>
        )
      }

      const { getByText } = render(
        <HardReset dependency={[]}>
          <Counter />
        </HardReset>,
      )

      expect(getByText(MOCK_COUNTER_TITLE)).toBeInTheDocument()
      expect(getByText('0')).toBeInTheDocument()

      //increment count
      act(() => {
        getByText('+').click()
      })

      expect(getByText('1')).toBeInTheDocument()
    })

    it('do not broke state on rerender with class component', () => {
      const MOCK_COUNTER_TITLE = 'Counter'

      class Counter extends Component {
        state = {
          count: 0,
        }

        render() {
          const { count } = this.state

          return (
            <>
              <strong>{MOCK_COUNTER_TITLE}</strong>
              <span>{count}</span>
              <button onClick={() => this.setState({ count: count + 1 })}>+</button>
            </>
          )
        }
      }

      const { getByText } = render(
        <HardReset dependency={[]}>
          <Counter />
        </HardReset>,
      )

      expect(getByText(MOCK_COUNTER_TITLE)).toBeInTheDocument()
      expect(getByText('0')).toBeInTheDocument()

      //increment count
      act(() => {
        getByText('+').click()
      })

      expect(getByText('1')).toBeInTheDocument()
    })

    describe('reset state with FC', () => {
      const ODD_INIT_STATE = 1
      const EVEN_INIT_STATE = 2

      const SWITCH_MODE_BUTTON_TEXT = 'switch mode'

      const CounterByTwo = ({ startNumber }: { startNumber: number }) => {
        const [state, setState] = useState(startNumber)

        return (
          <>
            <strong>counter by two</strong>
            <span>{state}</span>
            <button onClick={() => setState(state + 2)}>+</button>
          </>
        )
      }

      it('with one child', () => {
        const OddEvenCounter = () => {
          const [mode, setMode] = useState('odd')

          const toggleMode = () => {
            if (mode === 'odd') {
              setMode('even')

              return
            }

            setMode('odd')
          }

          const startNumber = mode === 'odd' ? ODD_INIT_STATE : EVEN_INIT_STATE

          return (
            <HardReset dependency={[mode]}>
              <button onClick={toggleMode}>{SWITCH_MODE_BUTTON_TEXT}</button>
              <CounterByTwo startNumber={startNumber} />
            </HardReset>
          )
        }

        const { getByText } = render(<OddEvenCounter />)

        expect(getByText(ODD_INIT_STATE)).toBeInTheDocument()

        // add 2 to odd number
        act(() => {
          getByText('+').click()
        })

        expect(getByText(ODD_INIT_STATE + 2)).toBeInTheDocument()

        // switch to even - inner state should be reset
        act(() => {
          getByText(SWITCH_MODE_BUTTON_TEXT).click()
        })

        expect(getByText(EVEN_INIT_STATE)).toBeInTheDocument()

        // add 2 to odd number - component should work well
        act(() => {
          getByText('+').click()
        })

        expect(getByText(EVEN_INIT_STATE + 2)).toBeInTheDocument()
      })

      it('with children', () => {
        const OddEvenCounter = () => {
          const [mode, setMode] = useState('odd')

          const toggleMode = () => {
            if (mode === 'odd') {
              setMode('even')

              return
            }

            setMode('odd')
          }

          const startNumber = mode === 'odd' ? ODD_INIT_STATE : EVEN_INIT_STATE

          return (
            <HardReset dependency={[mode]}>
              <button onClick={toggleMode}>{SWITCH_MODE_BUTTON_TEXT}</button>
              <CounterByTwo startNumber={startNumber} />
              <CounterByTwo startNumber={startNumber} />
              <CounterByTwo startNumber={startNumber} />
            </HardReset>
          )
        }

        const { getAllByText, getByText } = render(<OddEvenCounter />)

        expect(getAllByText(ODD_INIT_STATE).length).toBe(3)

        // add 2 to odd number
        act(() => {
          getAllByText('+').forEach((plusButton) => {
            plusButton.click()
          })
        })

        expect(getAllByText(ODD_INIT_STATE + 2).length).toBe(3)

        // switch to even - inner state should be reset
        act(() => {
          getByText(SWITCH_MODE_BUTTON_TEXT).click()
        })

        expect(getAllByText(EVEN_INIT_STATE).length).toBe(3)

        // add 2 to odd number
        act(() => {
          getAllByText('+').forEach((plusButton) => {
            plusButton.click()
          })
        })

        expect(getAllByText(EVEN_INIT_STATE + 2).length).toBe(3)
      })
    })
  })

  describe('reset state with class component', () => {
    const ODD_INIT_STATE = 1
    const EVEN_INIT_STATE = 2

    const SWITCH_MODE_BUTTON_TEXT = 'switch mode'

    class CounterByTwo extends Component<{ startNumber: number }, { count: number }> {
      constructor(props: { startNumber: number }) {
        super(props)

        this.state = {
          count: props.startNumber,
        }
      }

      render() {
        const { count } = this.state
        return (
          <>
            <strong>counter by two</strong>
            <span>{count}</span>
            <button onClick={() => this.setState({ count: count + 2 })}>+</button>
          </>
        )
      }
    }

    type TMode = 'odd' | 'even'

    it('with one child', () => {
      class OddEvenCounter extends Component<Record<string, never>, { mode: TMode }> {
        state = {
          mode: 'odd' as TMode,
        }

        toggleMode = (): void => {
          const { mode } = this.state

          if (mode === 'odd') {
            this.setState({ mode: 'even' })

            return
          }

          this.setState({ mode: 'odd' })
        }

        render() {
          const { mode } = this.state

          const startNumber = mode === 'odd' ? ODD_INIT_STATE : EVEN_INIT_STATE

          return (
            <HardReset dependency={[mode]}>
              <button onClick={this.toggleMode}>{SWITCH_MODE_BUTTON_TEXT}</button>
              <CounterByTwo startNumber={startNumber} />
            </HardReset>
          )
        }
      }

      const { getByText } = render(<OddEvenCounter />)

      expect(getByText(ODD_INIT_STATE)).toBeInTheDocument()

      // add 2 to odd number
      act(() => {
        getByText('+').click()
      })

      expect(getByText(ODD_INIT_STATE + 2)).toBeInTheDocument()

      // switch to even - inner state should be reset
      act(() => {
        getByText(SWITCH_MODE_BUTTON_TEXT).click()
      })

      expect(getByText(EVEN_INIT_STATE)).toBeInTheDocument()

      // add 2 to odd number - component should work well
      act(() => {
        getByText('+').click()
      })

      expect(getByText(EVEN_INIT_STATE + 2)).toBeInTheDocument()
    })

    it('with children', () => {
      class OddEvenCounter extends Component<Record<string, never>, { mode: TMode }> {
        state = {
          mode: 'odd' as TMode,
        }

        toggleMode = (): void => {
          const { mode } = this.state

          if (mode === 'odd') {
            this.setState({ mode: 'even' })

            return
          }

          this.setState({ mode: 'odd' })
        }

        render() {
          const { mode } = this.state

          const startNumber = mode === 'odd' ? ODD_INIT_STATE : EVEN_INIT_STATE

          return (
            <HardReset dependency={[mode]}>
              <button onClick={this.toggleMode}>{SWITCH_MODE_BUTTON_TEXT}</button>
              <CounterByTwo startNumber={startNumber} />
              <CounterByTwo startNumber={startNumber} />
              <CounterByTwo startNumber={startNumber} />
            </HardReset>
          )
        }
      }

      const { getByText, getAllByText } = render(<OddEvenCounter />)

      expect(getAllByText(ODD_INIT_STATE).length).toBe(3)

      // add 2 to odd number
      act(() => {
        getAllByText('+').forEach((plusButton) => {
          plusButton.click()
        })
      })

      expect(getAllByText(ODD_INIT_STATE + 2).length).toBe(3)

      // switch to even - inner state should be reset
      act(() => {
        getByText(SWITCH_MODE_BUTTON_TEXT).click()
      })

      expect(getAllByText(EVEN_INIT_STATE).length).toBe(3)

      // add 2 to odd number - component should work well
      act(() => {
        getAllByText('+').forEach((plusButton) => {
          plusButton.click()
        })
      })

      expect(getAllByText(EVEN_INIT_STATE + 2).length).toBe(3)
    })
  })
})
