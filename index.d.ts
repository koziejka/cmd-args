class State {
    public success: boolean
    public input: string[]
    public return: *
    public args: {}
}

// matching 
export const path: (args: {
    existing: boolean,
    network: boolean,
    allowWildcards: boolean,
    ext: (boolean | string[])
}) => ((state: State) => State)

export const url: (args: {
    protocols: string[],
    requireProtocol: boolean
}) => ((state: State) => State)

export const str: (...str: string) =>
    ((state: State) => State)

export const regex: (regex: RegExp, group: Number = 0) =>
    ((state: State) => State)

export const number: () =>
    ((state: State) => State)

// logic
export const or: (...rules: (state: State) => State) =>
    ((state: State) => State)

export const and: (...rules: (state: State) => State) =>
    ((state: State) => State)

export const optional: (rule: (state: State) => State) =>
    ((state: State) => State)

export const arg: (name: string, rule: (state: State) => State) =>
    ((state: State) => State)

export const set: (val: any) => (() => any)

// compile
export const compile = (rules: [{
    run: ((args: Object, params: Object) => any),
    rule: [(state: State) => State],
    parameters: [],
    strict: boolean
}]) => ((argv: string[]) => any)