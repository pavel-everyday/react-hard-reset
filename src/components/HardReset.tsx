import React, { useMemo, useRef, Fragment } from 'react'

interface Props {
  dependency: any[] // <- this is the dependency array
  children: any
}

const BASE_KEY = 'hard-reset-key-'
const BASE_KEY_LENGTH = BASE_KEY.length

export const HardReset = ({ dependency, children }: Props): JSX.Element => {
  const initKey = useRef(BASE_KEY + '1')

  const baseKey = useMemo(() => {
    const currentKeyCount = initKey.current.slice(BASE_KEY_LENGTH)
    const nextKeyCount = Number(currentKeyCount) + 1
    const nextKey = BASE_KEY + nextKeyCount

    initKey.current = nextKey

    return initKey.current
  }, [children, dependency])

  if (!Array.isArray(children)) {
    return <Fragment key={baseKey}>{children}</Fragment>
  }

  return (
    <Fragment key={baseKey}>
      {children.map((child) => {
        return child
      })}
    </Fragment>
  )
}
