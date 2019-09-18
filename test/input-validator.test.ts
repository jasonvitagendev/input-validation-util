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
        expect(mockedTest).toBeCalledWith(123, null);
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.transformedValue).toEqual(null);
        expect(validationResult.firstFailRule).toEqual({});
        expect(validationResult.allFailRules.length).toEqual(0);

        validate('abc');
        expect(mockedTest).toBeCalledWith('abc', null);
    });
});

describe('single rule invalid', () => {
    let mockedTest: any;
    let validate: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => !isNaN(value));
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest
        });
    });

    test('test function', () => {
        const validationResult = validate('abc');
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith('abc', null);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.transformedValue).toEqual(null);
        expect(validationResult.firstFailRule).toEqual({
            test: mockedTest,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailRules.length).toEqual(1);
        expect(validationResult.allFailRules[0]).toEqual({
            test: mockedTest,
            ruleName: 'isNumber'
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
        expect(mockedTest).toBeCalledWith(123, null);
        expect(mockedTransformValue).toBeCalledTimes(1);
        expect(mockedTransformValue).toBeCalledWith(123, null);
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.transformedValue).toEqual(123);
        expect(validationResult.firstFailRule).toEqual({});
        expect(validationResult.allFailRules.length).toEqual(0);
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
        expect(mockedTest).toBeCalledWith('abc', null);
        expect(mockedTransformValue).toBeCalledTimes(0);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.transformedValue).toEqual(null);
        expect(validationResult.firstFailRule).toEqual({
            test: mockedTest,
            transformValue: mockedTransformValue,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailRules.length).toEqual(1);
        expect(validationResult.allFailRules[0]).toEqual({
            test: mockedTest,
            transformValue: mockedTransformValue,
            ruleName: 'isNumber'
        });
    });
});

describe('single rule invalid with resetInputToValue', () => {
    let mockedTest: any;
    let validate: any;
    beforeEach(() => {
        mockedTest = jest.fn(value => value !== 0);
        validate = createInputValidator({
            ruleName: 'isNumber',
            test: mockedTest,
            resetInputToValue: 1
        });
    });

    test('test function', () => {
        const validationResult = validate(0);
        expect(mockedTest).toBeCalledTimes(1);
        expect(mockedTest).toBeCalledWith(0, null);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.firstFailRule.resetInputToValue).toEqual(1);
        expect(validationResult.firstFailRule).toEqual({
            test: mockedTest,
            ruleName: 'isNumber',
            resetInputToValue: 1
        });
        expect(validationResult.allFailRules.length).toEqual(1);
        expect(validationResult.allFailRules[0]).toEqual({
            test: mockedTest,
            ruleName: 'isNumber',
            resetInputToValue: 1
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
        expect(mockedIsNumber).toBeCalledWith(123, null);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(123, null);
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.transformedValue).toEqual(null);
        expect(validationResult.firstFailRule).toEqual({});
        expect(validationResult.allFailRules.length).toEqual(0);
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
        expect(mockedIsNumber).toBeCalledWith('abc', null);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', null);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.transformedValue).toEqual(null);
        expect(validationResult.firstFailRule).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailRules.length).toEqual(2);
        expect(validationResult.allFailRules[0]).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailRules[1]).toEqual({
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
        expect(mockedIsNumber).toBeCalledWith(123, null);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(123, null);
        expect(mockedFormatCurrency).toBeCalledTimes(1);
        expect(mockedFormatCurrency).toBeCalledWith(123, '123.00');
        expect(validationResult.valid).toBeTruthy();
        expect(validationResult.transformedValue).toEqual('RM123.00');
        expect(validationResult.firstFailRule).toEqual({});
        expect(validationResult.allFailRules.length).toEqual(0);
    });
});

describe('multiple rules invalid with transformValue', () => {
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
        const validationResult = validate(5);
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(5, null);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith(5, null);
        expect(mockedFormatCurrency).toBeCalledTimes(1);
        expect(mockedFormatCurrency).toBeCalledWith(5, null);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.transformedValue).toEqual('RMnull');
        expect(validationResult.firstFailRule).toEqual({
            test: mockedIsGreaterThan10,
            ruleName: 'isGreaterThan10',
            transformValue: mockedToFixed
        });
        expect(validationResult.allFailRules.length).toEqual(1);
        expect(validationResult.allFailRules[0]).toEqual({
            test: mockedIsGreaterThan10,
            ruleName: 'isGreaterThan10',
            transformValue: mockedToFixed
        });
    });

    test('test function', () => {
        const validationResult = validate('abc');
        expect(mockedIsNumber).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', null);
        expect(mockedIsGreaterThan10).toBeCalledTimes(1);
        expect(mockedIsNumber).toBeCalledWith('abc', null);
        expect(mockedFormatCurrency).toBeCalledTimes(1);
        expect(mockedFormatCurrency).toBeCalledWith('abc', null);
        expect(validationResult.valid).toBeFalsy();
        expect(validationResult.transformedValue).toEqual('RMnull');
        expect(validationResult.firstFailRule).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
        expect(validationResult.allFailRules.length).toEqual(2);
        expect(validationResult.allFailRules[0]).toEqual({
            test: mockedIsNumber,
            ruleName: 'isNumber'
        });
    });
});
