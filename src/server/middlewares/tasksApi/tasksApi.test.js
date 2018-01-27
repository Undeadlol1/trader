import 'babel-polyfill'
import slugify from 'slug'
import request from 'supertest'
import server from 'server/server'
import chai, { assert, expect } from 'chai'
import users from 'server/data/fixtures/users'
import { Tasks, User } from 'server/data/models'
import { loginUser } from 'server/test/middlewares/authApi.test'
chai.should();

const   agent = request.agent(server),
        username = users[0].username,
        password = users[0].password,
        name = "random name",
        slug = slugify(name)

export default describe('/tasks API', function() {

    before(async function() {
        // TODO add logout? to test proper user login?
        // Kill supertest server in watch mode to avoid errors
        server.close()

    })

    // clean up
    after(function() {
        return Tasks.destroy({where: { name }})
    })

    it('POST task', async function() {
        const user = await loginUser(username, password)
        await user.post('/api/tasks')
            .send({ name })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function(res) {
                return res.body.slug.should.be.equal(slug)
            })
            .catch(error => {
                console.error(error)
                throw new Error(error)
            })
    })

    it('GET tasks', function(done) {
        agent
            .get('/api/tasks')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.tasks.should.be.a('array')
                done()
            });
    })

    it('GET single task', function(done) {
        agent
            .get('/api/tasks/task/' + slug )
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.equal(name)
                done()
            });
    })

    // TODO PUT test

    it('fail to POST if not authorized', function(done) {
        agent.post('/api/tasks').expect(401, done)
    })

})