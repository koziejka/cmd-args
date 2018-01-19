const { url, path } = require('../rules')

describe('URL rule', () => {

    it('success: false -> success: false', () => {
        let state = { success: false, input: ['http://google.com'] }
        expect(url()(state)).toBe(state)
    })

    it('http', () => {
        let state = { success: true, input: ['http://google.com'] }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'http://google.com' })
    })

    it('https', () => {
        let state = { success: true, input: ['https://google.com'] }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'https://google.com' })
    })

    it('ip', () => {
        let state = { success: true, input: ['ftp://127.0.0.1'] }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'ftp://127.0.0.1' })
    })

    it('ip port', () => {
        let state = { success: true, input: ['http://192.168.1.21:80'] }
        expect(url({})(state)).toEqual({ success: true, input: [], return: 'http://192.168.1.21:80' })
    })

    it('host port', () => {
        let state = { success: true, input: ['https://google.com:80/'] }
        expect(url()(state)).toEqual({ success: true, input: [], return: 'https://google.com:80/' })
    })

    it('protocol restriction', () => {
        let state = { success: true, input: ['http://google.com'], return: null }
        expect(url({
            protocols: ['https']
        })(state)).toEqual({ success: false, input: ['http://google.com'], return: null })
    })

    it('protocol extantion', () => {
        let state = { success: true, input: ['xd://google.com?id=12'], return: null }
        expect(url({
            protocols: ['xd']
        })(state)).toEqual({ success: true, input: [], return: 'xd://google.com?id=12' })
    })

    it('require specifing protocol', () => {
        let state = { success: true, input: ['google.com'], return: null }
        expect(url({ requireProtocol: false })(state))
            .toEqual({ success: true, input: [], return: 'google.com' })

        expect(url({ requireProtocol: true })(state))
            .toEqual({ success: false, input: ['google.com'], return: null })
    })

})

describe('PATH rule', () => {

    it('success: false -> success: false', () => {
        let state = { success: false, input: ['http://google.com'] }
        expect(path()(state)).toBe(state)
    })

    it('existing file', () => {
        let state = { success: true, input: ['rules.js'] }
        expect(path({ existing: true })(state)).toEqual({ success: true, input: [], return: 'rules.js' })
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