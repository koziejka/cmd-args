const node_path = require('path')
const fs = require('fs')

/**
 * @version 1.0.0
 * @update koziejka
 * 
 * @todo wild card
 * @todo network check
 */
const path = (args = {}) => state => {
    if (state.success === false) return state

    const existing = args.existing === undefined ? false : args.existing
    const ext = args.ext === undefined ? false : args.ext

    if (existing && !fs.existsSync(state.input[0]))
        return {
            success: false,
            input: state.input,
            return: null,
            args: state.args
        }

    if (ext && !ext.some(x => x === node_path.parse(state.input[0]).ext))
        return {
            success: false,
            input: state.input,
            return: null,
            args: state.args
        }

    return {
        success: true,
        input: state.input.slice(1),
        return: state.input[0],
        args: state.args
    }

}

const urlTestRule = /(?:(\w+):\/\/)?[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/

/**
 * @author koziejka
 * @version 1.0.0
 */
const url = (args = {}) => state => {
    if (state.success === false) return state

    const protocols = args.protocols || ['http', 'https', 'ftp', 'file']
    const requireProtocol = args.requireProtocol === undefined ? true : args.requireProtocol

    const [, protocol] = state.input[0].match(urlTestRule)
    protocols.some(x => x === protocol) //?
    if (protocols.some(x => x === protocol) || !requireProtocol) {
        return {
            success: true,
            return: state.input[0],
            input: state.input.slice(1),
            args: state.args
        }
    } else return {
        success: false,
        input: state.input,
        return: state.return,
        args: state.args
    }
}


/**
 * @author koziejka
 * @version 1.0.0
 */
const str = (...str) => state => {
    if (state.success === false) return state

    let success = str.every((val, i) => state.input[i] === val)
    if (success)
        return {
            success,
            input: state.input.slice(str.length),
            return: str,
            args: state.args
        }
    else return {
        success,
        input: state.input,
        return: null,
        args: state.args
    }
}

/**
 * @version 1.0.0
 * @update koziejka
 */
const regex = (regex, group = 0) => state => {
    if (state.success === false) return state

    const result = state.input[0].match(regex)
    if (result) return {
        success: true,
        input: state.input.slice(1),
        return: result[group],
        args: state.args
    }
    else return {
        success: false,
        input: state.input,
        return: null,
        args: state.args
    }
}

/**
 * @todo implement
 */
const number = () => state => {
    if (state.success === false) return state
    const tmp = Number(state.input[0])
    if (tmp !== NaN) {
        return {
            success: true,
            input: state.input.slice(1),
            return: Number(state.input[0]),
            args: state.args
        }
    } else return {
        success: false,
        input: state.input,
        return: null,
        args: state.args
    }
}

module.exports = { path, url, str, regex }