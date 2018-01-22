const { url, path, str, regex, number } = require('../rules/matching')
const { and, arg, oneOrMore, optional, or, set, zeroOrMore } = require('../rules/logic')

describe('URL rule', () => {

    it('success: false -> success: false', () => {
        let state = { success: false, input: ['http://google.com'], args: {} }
        expect(url()(state)).toBe(state)
    })

    it('http', () => {
        let state = { success: true, input: ['http://google.com'], args: {} }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'http://google.com', args: {} })
    })

    it('https', () => {
        let state = { success: true, input: ['https://google.com'], args: {} }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'https://google.com', args: {} })
    })

    it('ip', () => {
        let state = { success: true, input: ['ftp://127.0.0.1'], args: {} }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'ftp://127.0.0.1', args: {} })
    })

    it('ip port', () => {
        let state = { success: true, input: ['http://192.168.1.21:80'], args: {} }
        expect(url({})(state)).toEqual({ success: true, input: [], return: 'http://192.168.1.21:80', args: {} })
    })

    it('host port', () => {
        let state = { success: true, input: ['https://google.com:80/'], args: {} }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'https://google.com:80/', args: {} })
    })

    it('protocol restriction', () => {
        let state = { success: true, input: ['http://google.com'], return: null, args: {} }
        expect(url({
            protocols: ['https']
        })(state)).toEqual({ success: false, input: ['http://google.com'], return: null, args: {} })
    })

    it('protocol extantion', () => {
        let state = { success: true, input: ['xd://google.com?id=12'], return: null, args: {} }
        expect(url({
            protocols: ['xd']
        })(state)).toEqual({ success: true, input: [], return: 'xd://google.com?id=12', args: {} })
    })

    it('require specifing protocol', () => {
        let state = { success: true, input: ['google.com'], return: null, args: {} }
        expect(url({ requireProtocol: false })(state))
            .toEqual({ success: true, input: [], return: 'google.com', args: {} })

        expect(url({ requireProtocol: true })(state))
            .toEqual({ success: false, input: ['google.com'], return: null, args: {} })
    })

})

describe('PATH rule', () => {

    it('success: false -> success: false', () => {
        let state = { success: false, input: ['http://google.com'] }
        expect(path()(state)).toBe(state)
    })

    it('existing file', () => {
        let state = { success: true, input: ['rules.js'], args: {} }
        expect(path({ existing: true })(state)).toEqual({ success: false, input: ['rules.js'], return: null, args: {} })
    })

    it('ext', () => {
        let state = { success: true, input: ['rules.js'] }
        expect(path({ ext: ['.exe'] })(state))
            .toEqual({ success: false, input: ['rules.js'], return: null })
        state = { success: true, input: ['rules.js'] }
        expect(path({ ext: ['.js'] })(state))
            .toEqual({ success: true, input: [], return: 'rules.js' })
    })
})

describe('str rule', () => {

    it('single string', () => {
        let state = { success: true, input: ['rules.js'], args: {} }
        expect(str('rules.js')(state)).toEqual({ success: true, input: [], return: 'rules.js', args: {} })
    })

    it('failing', () => {
        let state = { success: true, input: ['rules.js', '1', '2', 'skdjfhkjhsdf'], args: {} }
        expect(str('rulese.js')(state)).toEqual({ success: false, input: ['rules.js', '1', '2', 'skdjfhkjhsdf'], return: null, args: {} })
    })

})

describe('regex rule', () => {

    it('match', () => {
        let state = { success: true, input: ['rules.js', '1', '2', 'skdjfhkjhsdf'], args: {} }
        expect(regex(/^(\w+)\.\w+$/)(state)).toEqual({ success: true, input: ['1', '2', 'skdjfhkjhsdf'], return: 'rules.js', args: {} })
    })

    it('match group', () => {
        let state = { success: true, input: ['rules.js', '1', '2', 'skdjfhkjhsdf'], args: {} }
        expect(regex(/^(\w+)\.\w+$/, 1)(state)).toEqual({ success: true, input: ['1', '2', 'skdjfhkjhsdf'], return: 'rules', args: {} })
    })

    it('failing', () => {
        let state = { success: true, input: ['rules.js', '1', '2', 'skdjfhkjhsdf'], args: {} }
        expect(regex(/^(\W+)\.\w+$/, 1)(state)).toEqual({ success: false, input: ['rules.js', '1', '2', 'skdjfhkjhsdf'], return: null, args: {} })
    })

})

describe('number rule', () => {

    it('number', () => {
        let state = { success: true, input: ['1.23'], args: {} }
        expect(number()(state)).toEqual({ success: true, input: [], return: 1.23, args: {} })
    })

    it('int', () => {
        let state = { success: true, input: ['1.23'], args: {} }
        expect(number({ int: true })(state)).toEqual({ success: false, input: ['1.23'], return: null, args: {} })
    })

    it('custom base', () => {
        let state = { success: true, input: ['ff'], args: {} }
        expect(number({ base: 16 })(state)).toEqual({ success: true, input: [], return: 255, args: {} })
    })

    it('custom base up', () => {
        let state = { success: true, input: ['ff'], args: {} }
        expect(number({ base: 10 })(state)).toEqual({ success: false, input: ['ff'], return: null, args: {} })
    })

})

describe('and', () => {
    it('pass', () => {
        let state = { success: true, input: ['ff'], args: {} }
        expect(and(regex(/^f/i), number({ base: 16 }))(state))
            .toEqual({ success: true, input: [], return: 255, args: {} })
    })

    it('fail', () => {
        let state = { success: true, input: ['ff'], args: {} }
        expect(and(regex(/xd/i), number({ base: 16 }))(state))
            .toEqual({ success: false, input: ['ff'], return: null, args: {} })
    })
})

describe('or', () => {
    it('pass', () => {
        let state = { success: true, input: ['ff'], args: {} }
        expect(or(str('xd'), number({ base: 16 }))(state))
            .toEqual({ success: true, input: [], return: 255, args: {} })
    })

    it('fail', () => {
        let state = { success: true, input: ['ff'], args: {} }
        expect(or(str('foo'), str('xd'))(state))
            .toEqual({ success: false, input: ['ff'], return: null, args: {} })
    })
})

describe('optional', () => {
    it('pass', () => {
        let state = { success: true, input: ['xd'], args: {} }
        expect(optional(str('xd'))(state))
            .toEqual({ success: true, input: [], return: 'xd', args: {} })
    })
    it('fail', () => {
        let state = { success: true, input: ['xdddd'], args: {} }
        expect(optional(str('xd'))(state))
            .toEqual({ success: true, input: ['xdddd'], return: null, args: {} })
    })
})

describe('set', () => {
    it('pass', () => {
        expect(set('xd')()).toEqual('xd')
    })
})

describe('oneOrMore', () => {
    it('1 match', () => {
        let state = { success: true, input: ['1', 'xd'], args: {} }
        expect(oneOrMore(number())(state))
            .toEqual({ success: true, input: ['xd'], return: [1], args: {} })
    })
    it('3 matches', () => {
        let state = { success: true, input: ['1', '2', '3', 'xd'], args: {} }
        expect(oneOrMore(number())(state))
            .toEqual({ success: true, input: ['xd'], return: [1, 2, 3], args: {} })
    })
    it('0 matches', () => {
        let state = { success: true, input: ['xd'], args: {} }
        expect(oneOrMore(number())(state))
            .toEqual({ success: false, input: ['xd'], return: null, args: {} })
    })
})

describe('zeroOrMore', () => {
    it('1 match', () => {
        let state = { success: true, input: ['1', 'xd'], args: {} }
        expect(zeroOrMore(number())(state))
            .toEqual({ success: true, input: ['xd'], return: [1], args: {} })
    })
    it('2 matches', () => {
        let state = { success: true, input: ['1', '3', 'xd'], args: {} }
        expect(zeroOrMore(number())(state))
            .toEqual({ success: true, input: ['xd'], return: [1, 3], args: {} })
    })
    it('0 matches', () => {
        let state = { success: true, input: ['xd'], args: {} }
        expect(zeroOrMore(number())(state))
            .toEqual({ success: true, input: ['xd'], return: [], args: {} })
    })
})