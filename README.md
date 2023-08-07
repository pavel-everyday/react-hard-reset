# React Hard Reset

## Helps you to reset inner state of nested components.

If you can't to manage inner state of some nested components, for example if there are third-party components, but you need to update or reset their state - use this library.

----

```
import { HardReset } from 'react-hard-reset'

const MyComponent = () => {
    ...
    ...
    return (
        ...
        ...

        <HardReset dependency={[deps]}> 
            // if some of the deps is changed - all inner components will be reset  
                <SomeComponent ... />
        </HardReset>

        ...
        ...
    )
}

```
----
### Requirements:
- ReactJS versions more or equal 16.8.0.

### Dependencies:
- ReactJS