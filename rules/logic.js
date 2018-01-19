/**
 * @version 1.0.0
 * @update koziejka
 * @param {} rules 
 * @returns {(state:State)=>State}
 */
const or = (...rules) => state => {
    if (state.success === false) return false
    let result
    rules.some(rule => {
        result = rule(state)
        return result.success
    })
    return result
}

/**
 * @version 1.0.0
 * @update koziejka
 * @param {...((state: State) => State)} rules 
 * @returns {(state:State)=>State}
 */
const and = (...rules) => state => {
    if (state.success === false) return false
    let result
    if (rules.every(rule => {
        result = rule(state)
        return result.success
    })) return result
    else return {
        success: false,
        input: state.input,
        return: null,
        args: state.args
    }
}

const optional = rule => state => {
    if (state.success === false) return state

}

/** 
 * @version 1.0.0
 * @update koziejka
 */
const arg = (name, rule) => state => {
    if (state.success === false) return state
    
    let result = rule(state)
    result.args[name] = result.return
    return result
}

/** 
 * @version 1.0.0
 * @update koziejka
 */
const set = val => {
    const set = () => val
    set.set = true
    return set
}