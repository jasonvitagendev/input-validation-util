interface Rule {
    test?: (value: any, transformedValue: any) => boolean;
    resetInputToValue?: any;
    transformValue?: (value: any, transformedValue: any) => any;
    ruleName: string;
}

interface Result {
    firstFailedRule: Rule;
    allFailedRules: Rule[];
    valid: boolean;
    transformedValue: any;
}

type RulesParam = Rule | Rule[];

export const createInputValidator = (rules: RulesParam) => (value: any): Result => {
    const newRules = Array.isArray(rules) ? rules : [rules];
    // iterate rules
    return newRules.reduce(
        (acc, rule, index) => {
            const {test, transformValue} = rule;
            // in the first rule, make transformedValue the same as value
            acc.transformedValue = index === 0 ? value : acc.transformedValue;
            // run test
            const valid = test ? test(value, acc.transformedValue) : true;
            if (!valid) {
                // get first failed rule
                acc.firstFailedRule = Object.keys(acc.firstFailedRule).length
                    ? acc.firstFailedRule
                    : rule;
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
            firstFailedRule: {} as Rule,
            allFailedRules: [],
            valid: true,
            transformedValue: null
        } as Result
    );
};
