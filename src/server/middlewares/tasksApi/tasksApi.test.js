import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import generateUuid from 'uuid/v4'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Tasks, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name),
        symbol = 'ETHBTC'

export default describe('/tasks API', function() {

    // Kill supertest server in watch mode to avoid errors
    before(async () => server.close())

    // clean up
    after(async () => Tasks.destroy({where: {symbol}}))

    // it('POST task', async function() {
    //     const user = await loginUser(username, password)
    //     await user.post('/api/tasks')
    //         .send({ name })
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .then(function(res) {
    //             return res.body.slug.should.be.equal(slug)
    //         })
    //         .catch(error => {
    //             console.error(error)
    //             throw new Error(error)
    //         })
    // })

    // it('GET tasks', function(done) {
    //     agent
    //         .get('/api/tasks')
    //         .expect('Content-Type', /json/)
    //         .expect(200)
    //         .end(function(err, res) {
    //             if (err) return done(err);
    //             res.body.tasks.should.be.a('array')
    //             done()
    //         });
    // })

    it('GET single task', async () => {
        const payload = {
            symbol,
            UserId: 12323,
            strategy: 'buy_sell',
        }
        const task = await Tasks.create(payload)
        await agent
            .get('/api/tasks/task/' + task.id)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(({body}) => {
                const { logs } = body
                expect(body).to.have.property('id', task.id)
                expect(body).to.have.properties(payload)
                expect(logs.values).to.be.a('array')
                // expect(logs.total).to.eq(1)
                // expect(logs.values).to.eq(1)
            })
    })

    // // TODO PUT test

    // it('fail to POST if not authorized', function(done) {
    //     agent.post('/api/tasks').expect(401, done)
    // })

})