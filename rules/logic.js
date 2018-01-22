/**
 * @version 1.0.0
 * @update koziejka
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

/** 
 * @version 1.0.1
 * @update koziejka
 */
const optional = rule => state => {
    if (state.success === false) return state

    let result = rule(state)
    result.success = true
    return result
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

/**
 * @version 1.0.0
 * @update koziejka
 */
const oneOrMore = rule => state => {
    if (state.success === false) return state
    let result = rule(state)
    if (result.success === false) return {
        success: false,
        input: state.input,
        return: null,
        args: state.args
    }
    let returned = [result.return]
    
    while ((result = rule(result)) && result.success)
        returned.push(result.return)

    result.success = true
    result.return = returned
    return result
}

/**
 * @version 1.0.0
 * @update koziejka
 */
const zeroOrMore = rule => state => {
    if (state.success === false) return state

    let result = rule(state)
    if (result.success === false) return {
        success: true,
        input: state.input,
        return: [],
        args: state.args
    }
    let returned = [result.return]
    
    while ((result = rule(result)) && result.success)
        returned.push(result.return)

    result.success = true
    result.return = returned
    return result
}

module.exports = { or, and, optional, arg, set, oneOrMore, zeroOrMore }