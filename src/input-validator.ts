interface Rule {
    test?: (value: any, transformedValue: any) => boolean;
    resetInvalidInput?: (value: any, transformedValue: any) => any;
    transformValue?: (value: any, transformedValue: any) => any;
    ruleName: string;
}

interface Result {
    firstFailedRule: Rule | null;
    allFailedRules: Rule[];
    valid: boolean;
    transformedValue: any;
    resetInputValue: any;
}

type RulesParam = Rule | Rule[];

export const createInputValidator = (rules: RulesParam) => (value: any): Result => {
    const newRules = Array.isArray(rules) ? rules : [rules];
    // iterate rules
    return newRules.reduce(
        (acc, rule, index) => {
            const {test, transformValue, resetInvalidInput} = rule;
            // in the first rule, make transformedValue the same as value
            acc.transformedValue = index === 0 ? value : acc.transformedValue;
            // run test
            const valid = test ? test(value, acc.transformedValue) : true;
            if (!valid) {
                // get the first failed rule
                if (!acc.firstFailedRule) {
                    acc.firstFailedRule = rule;
                    acc.resetInputValue = resetInvalidInput
                        ? resetInvalidInput(value, acc.transformedValue)
                        : acc.resetInputValue;
                }
                // accumulate all failed rules
                acc.allFailedRules = acc.allFailedRules.concat(rule);
                // invalidate
                acc.valid = false;
            } else {
                // only transform value if the input is valid
                acc.transformedValue = transformValue
                    ? transformValue(value, acc.transformedValue)
                    : acc.transformedValue;
            }
            return acc;
        },
        // initial state
        {
            firstFailedRule: null,
            allFailedRules: [],
            valid: true,
            transformedValue: null,
            resetInputValue: null
        } as Result
    );
};
