/**
 * @version 1.0.0
 * @update koziejka
 */
const compile = rules => argv => {
    loop: for (let { run, rule, parameters = [], strict = false } of rules) {

        let state = { input: argv, success: true, args: {}, return: null }

        for (let _rule of rule) {
            state = _rule(state)
            if (state.success === false) {
                continue loop
            }
        }

        const params = {}

        for (let i = 0; i < state.input.length; i++) {
            if (parameters[state.input[i]]) {
                if (!parameters[state.input[i]].set) {

                    if (state.input.length - i < 2) continue
                    let result = parameters[state.input[i]]({
                        success: true,
                        input: [state.input[i + 1]]
                    })
                    if (result.success) {
                        params[state.input[i]] = result.return
                        state.input.splice(i, 2)
                        i -= 3
                    } else if (strict) {
                        continue loop
                    }
                }
                else {
                    params[state.input[i]] = parameters[state.input[i]]()
                    state.input.splice(i, 1)
                    i -= 2
                }
            }
        }

        if (strict && state.input.length > 0) continue

        return run(state.args, params)
    }
}

module.exports = compile