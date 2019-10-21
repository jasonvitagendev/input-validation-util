# input-validation-util

A library to validate and transform input value using declarative rules

## Installation

	npm i input-validation-util

## Usage

Import,

```javascript
import {createInputValidator} from '../src/input-validator';
```

#### Example 1

Define rules,

```javascript
	const validate = createInputValidator([
    	{
            ruleName: 'is / can be number',
            test: value => !isNaN(value),
            transformValue: value => Number(value)
        },
        {
            ruleName: 'round number',
            transformValue: (value, transformedValue) =>
                Math.round(transformedValue)
        },
        {
            ruleName: 'meet minimum value',
            test: (value, transformedValue) => transformedValue >= 10
        }
    ]);
```

Validate input,

```javascript
	const result = validate('20.5');
```

Use the validation result,

```javascript
	if (result.valid) {
		// result.inputValue === '20.5'
    	// result.transformedValue === 21
	    // result.firstFailedRule === null
    	// result.allFailedRules.length === 0
	}
```
