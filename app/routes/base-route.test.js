/* it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
}) */


const app = require('../../app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

/* it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})  */

it('gets the test endpoint', async done => {
    const response = await request.get('/test')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
    done()
})