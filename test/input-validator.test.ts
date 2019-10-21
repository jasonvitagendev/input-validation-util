import {createInputValidator} from '../src/input-validator';

describe('single rule valid', () => {
    let mockedTest: any;
    let validate: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => !!value);
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest
        });
    });

    test('test function', () => {
        const validationResult = validate(123);
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith(123, 123);
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.inputValue).toEqual(123);
        expect(validationResult.transformedValue).toEqual(123);
        expect(validationResult.firstFailedRule).toEqual(null);
        expect(validationResult.allFailedRules.length).toEqual(0);

        validate('abc');
        expect(mockedTest).toBeCalledWith('abc', 'abc');
    });
});

describe('single rule invalid', () => {
    let mockedTest: any;
    let validate: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => !isNaN(value));
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest,
            errorMessage: 'Input is not a number'
        });
    });

    test('test function', () => {
        const validationResult = validate('abc');
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith('abc', 'abc');
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.inputValue).toEqual('abc');
        expect(validationResult.transformedValue).toEqual('abc');
        expect(validationResult.firstFailedRule).toEqual({
            test: mockedTest,
            ruleName: 'isNumber',
            errorMessage: 'Input is not a number'
        });
        expect(validationResult.allFailedRules.length).toEqual(1);
        expect(validationResult.allFailedRules[0]).toEqual({
            test: mockedTest,
            ruleName: 'isNumber',
            errorMessage: 'Input is not a number'
        });
    });
});

describe('single rule valid with transformValue', () => {
    let mockedTest: any;
    let mockedTransformValue: any;
    let validate: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => !!value);
        mockedTransformValue = jest.fn((value, transformValue) => value);
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest,
            transformValue: mockedTransformValue
        });
    });

    test('test function', () => {
        const validationResult = validate(123);
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith(123, 123);
        expect(mockedTransformValue).toBeCalledTimes(1);
        expect(mockedTransformValue).toBeCalledWith(123, 123);
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.inputValue).toEqual(123);
        expect(validationResult.transformedValue).toEqual(123);
        expect(validationResult.firstFailedRule).toEqual(null);
        expect(validationResult.allFailedRules.length).toEqual(0);
    });
});

describe('single rule invalid with transformValue', () => {
    let mockedTest: any;
    let mockedTransformValue: any;
    let validate: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => !isNaN(value));
        mockedTransformValue = jest.fn((value, transformValue) => value);
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest,
            transformValue: mockedTransformValue
        });
    });

    test('test function', () => {
        const validationResult = validate('abc');
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith('abc', 'abc');
        expect(mockedTransformValue).toBeCalledTimes(0);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.inputValue).toEqual('abc');
        expect(validationResult.transformedValue).toEqual('abc');
        expect(validationResult.firstFailedRule).toEqual({
            test: mockedTest,
            transformValue: mockedTransformValue,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailedRules.length).toEqual(1);
        expect(validationResult.allFailedRules[0]).toEqual({
            test: mockedTest,
            transformValue: mockedTransformValue,
            ruleName: 'isNumber'
        });
    });
});

describe('single rule invalid with resetInputToValue', () => {
    let mockedTest: any;
    let validate: any;
    let mockedResetInput: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => value !== 0);
        mockedResetInput = jest.fn(value => 1);
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest,
            resetInvalidInput: mockedResetInput
        });
    });

    test('test function', () => {
        const validationResult = validate(0);
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith(0, 0);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.inputValue).toEqual(0);
        expect(validationResult.resetInputValue).toEqual(1);
        expect(validationResult.firstFailedRule).toEqual({
            test: mockedTest,
            ruleName: 'isNumber',
            resetInvalidInput: mockedResetInput
        });
        expect(validationResult.allFailedRules.length).toEqual(1);
        expect(validationResult.allFailedRules[0]).toEqual({
            test: mockedTest,
            ruleName: 'isNumber',
            resetInvalidInput: mockedResetInput
        });
    });
});

describe('multiple rules valid', () => {
    let mockedIsNumber: any;
    let mockedIsGreaterThan10: any;
    let validate: any;
    beforeEach(() => {
        mockedIsNumber = jest.fn(value => !isNaN(value));
        mockedIsGreaterThan10 = jest.fn(value => value > 10);
        validate = createInputValidator([
            {
                ruleName: 'isNumber',
                test: mockedIsNumber
            },
            {
                ruleName: 'isGreaterThan10',
                test: mockedIsGreaterThan10
            }
        ]);
    });

    test('test function', () => {
        const validationResult = validate(123);
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(123, 123);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(123, 123);
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.inputValue).toEqual(123);
        expect(validationResult.transformedValue).toEqual(123);
        expect(validationResult.firstFailedRule).toEqual(null);
        expect(validationResult.allFailedRules.length).toEqual(0);
    });
});

describe('multiple rules invalid', () => {
    let mockedIsNumber: any;
    let mockedIsGreaterThan10: any;
    let validate: any;
    beforeEach(() => {
        mockedIsNumber = jest.fn(value => !isNaN(value));
        mockedIsGreaterThan10 = jest.fn(value => value > 10);
        validate = createInputValidator([
            {
                ruleName: 'isNumber',
                test: mockedIsNumber
            },
            {
                ruleName: 'isGreaterThan10',
                test: mockedIsGreaterThan10
            }
        ]);
    });

    test('test function', () => {
        const validationResult = validate('abc');
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', 'abc');
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', 'abc');
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.inputValue).toEqual('abc');
        expect(validationResult.transformedValue).toEqual('abc');
        expect(validationResult.firstFailedRule).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailedRules.length).toEqual(2);
        expect(validationResult.allFailedRules[0]).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailedRules[1]).toEqual({
            test: mockedIsGreaterThan10,
            ruleName: 'isGreaterThan10'
        });
    });
});

describe('multiple rules valid with transformValue', () => {
    let mockedIsNumber: any;
    let mockedIsGreaterThan10: any;
    let mockedToFixed: any;
    let mockedFormatCurrency: any;
    let validate: any;
    beforeEach(() => {
        mockedIsNumber = jest.fn(value => !isNaN(value));
        mockedIsGreaterThan10 = jest.fn(value => value > 10);
        mockedToFixed = jest.fn(value => value.toFixed(2));
        mockedFormatCurrency = jest.fn((value, transformedValue) => `RM${transformedValue}`);
        validate = createInputValidator([
            {
                ruleName: 'isNumber',
                test: mockedIsNumber
            },
            {
                ruleName: 'isGreaterThan10',
                test: mockedIsGreaterThan10,
                transformValue: mockedToFixed
            },
            {
                ruleName: 'formatCurrency',
                transformValue: mockedFormatCurrency
            }
        ]);
    });

    test('test function', () => {
        const validationResult = validate(123);
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(123, 123);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(123, 123);
        expect(mockedFormatCurrency).toBeCalledTimes(1);
        expect(mockedFormatCurrency).toBeCalledWith(123, '123.00');
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.inputValue).toEqual(123);
        expect(validationResult.transformedValue).toEqual('RM123.00');
        expect(validationResult.firstFailedRule).toEqual(null);
        expect(validationResult.allFailedRules.length).toEqual(0);
    });
});

describe('multiple rules invalid with transformValue', () => {
    let mockedIsNumber: any;
    let mockedIsGreaterThan10: any;
    let mockedToFixed: any;
    let mockedFormatCurrency: any;
    let validate: any;
    let mockedResetInvalidInput: any;
    beforeEach(() => {
        mockedIsNumber = jest.fn(value => !isNaN(value));
        mockedIsGreaterThan10 = jest.fn(value => value > 10);
        mockedToFixed = jest.fn(value => value.toFixed(2));
        mockedFormatCurrency = jest.fn((value, transformedValue) => `RM${transformedValue}`);
        mockedResetInvalidInput = jest.fn((value, transformedValue) => transformedValue + 15);
        validate = createInputValidator([
            {
                ruleName: 'isNumber',
                test: mockedIsNumber
            },
            {
                ruleName: 'isGreaterThan10',
                test: mockedIsGreaterThan10,
                transformValue: mockedToFixed,
                resetInvalidInput: mockedResetInvalidInput
            },
            {
                ruleName: 'formatCurrency',
                transformValue: mockedFormatCurrency
            }
        ]);
    });

    test('test function', () => {
        const validationResult = validate(5);
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(5, 5);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(5, 5);
        expect(mockedFormatCurrency).toBeCalledTimes(1);
        expect(mockedFormatCurrency).toBeCalledWith(5, 5);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.inputValue).toEqual(5);
        expect(validationResult.transformedValue).toEqual('RM5');
        expect(validationResult.resetInputValue).toEqual(20);
        expect(validationResult.firstFailedRule).toEqual({
            test: mockedIsGreaterThan10,
            ruleName: 'isGreaterThan10',
            transformValue: mockedToFixed,
            resetInvalidInput: mockedResetInvalidInput
        });
        expect(validationResult.allFailedRules.length).toEqual(1);
        expect(validationResult.allFailedRules[0]).toEqual({
            test: mockedIsGreaterThan10,
            ruleName: 'isGreaterThan10',
            transformValue: mockedToFixed,
            resetInvalidInput: mockedResetInvalidInput
        });
    });

    test('test function', () => {
        const validationResult = validate('abc');
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', 'abc');
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', 'abc');
        expect(mockedFormatCurrency).toBeCalledTimes(1);
        expect(mockedFormatCurrency).toBeCalledWith('abc', 'abc');
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.inputValue).toEqual('abc');
        expect(validationResult.transformedValue).toEqual('RMabc');
        expect(validationResult.firstFailedRule).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailedRules.length).toEqual(2);
        expect(validationResult.allFailedRules[0]).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
    });
});
