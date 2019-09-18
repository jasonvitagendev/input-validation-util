interface Rule {
    test?: (value: any, transformedValue: any) => boolean;
    resetInputToValue?: any;
    transformValue?: (value: any, transformedValue: any) => any;
    ruleName: string;
}

interface Result {
    firstFailRule: Rule;
    allFailRules: Rule[];
    valid: boolean;
    transformedValue: any;
}

type RulesParam = Rule | Rule[];

export const createInputValidator = (rules: RulesParam) => (value: any): Result => {
    const newRules = Array.isArray(rules) ? rules : [rules];
    // iterate rules
    return newRules.reduce(
        (acc, rule) => {
            const {test, transformValue} = rule;
            // run test
            const valid = test ? test(value, acc.transformedValue) : true;
            if (!valid) {
                // get first failed rule
                acc.firstFailRule = Object.keys(acc.firstFailRule).length
                    ? acc.firstFailRule
                    : rule;
                // accumulate all failed rules
                acc.allFailRules = acc.allFailRules.concat(rule);
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
            firstFailRule: {} as Rule,
            allFailRules: [],
            valid: true,
            transformedValue: null
        } as Result
    );
};
