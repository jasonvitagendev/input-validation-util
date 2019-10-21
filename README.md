# input-validation-util

A library to validate and transform input value using declarative rules

## Installation

	npm i input-validation-util

## Usage

Import,

```javascript
import {createInputValidator} from '../src/input-validator';
```

#### Example 1: using correct input

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
        test: (value, transformedValue) => transformedValue >= 10,
        resetInvalidInput: (value, transformedValue) => `${value} is less than 10`
    }
]);
```

- **ruleName** is arbitrary and is the only compulsory option
- **test** callback
	- returns a boolean based on  your custom validation logic
	- returns true for valid input
	- first failed rule will be available in the validation result as **firstFailedRule**
	- all failed rules will be available in the validation result as **allFailedRules**
- **transformValue** callback
	- returns a value using your custom transformation logic
	- the transformed value will be available as the second parameter in **test**, **transformValue** and **resetInvalidInput** callbacks of subsequent rule
	- it is run in all conditions
		- **test** callback returns true
		- **test** callback is not provided
		- **except**: **test** callback returns false
	- transformed value returned from the last rule will be available in the validation result as **transformedValue**
- **resetInvalidInput** callback
	- returns a custom value
	- it is run only when **test** callback returns false
	- value returned from the first failed rule will be available in the validation result as **resetInputValue**
	- it is named as such because it is intended to provide a value to reset invalid input

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
    // result.resetInputValue === null
}
```

#### Example 2: using incorrect input

Validate input,

```javascript
const result = validate('twenty');	
```

Use the validation result,

```javascript
if (!result.valid) {
    // result.inputValue === 5
    // result.transformedValue === 5
    // result.firstFailedRule.ruleName === 'meet minimum value'
    // result.allFailedRules.length === 1
    // result.resetInputValue === '5 is less than 10'
}
```

## API Reference

### createInputValidator(rules: Rule | Rule[]): (value: any) => Result