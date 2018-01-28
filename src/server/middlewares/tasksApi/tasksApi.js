import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { setInterval } from 'timers'
import { Tasks } from 'server/data/models'
import handleTasks from 'server/bot/handleTasks'
import { mustLogin } from 'server/services/permissions'
import { fetchPricesAndSave } from 'server/bot/binanceApi'

const limit = 12
const interval = 1000 * 30

if (process.env.NODE_ENV != 'test') {
  setInterval(async () => {
    console.log('interval is running')
    // fetch data
    const prices = await fetchPricesAndSave()
    // console.log('prices: ', prices);
    // const accountOrders =
    // const accountBalance =
    // check if there are active tasks
    const activeTasks = await Tasks.findAll({where: {isDone: false}})
    console.log('activeTasks: ', activeTasks && activeTasks.length);
    // handle tasks if there are
    if (activeTasks) handleTasks(activeTasks)
  }, interval);
}

export default Router()

  // get all tasks
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalTaskss = await Tasks.count(),
            offset = page ? limit * (page -1) : 0,
            totalPages = Math.ceil(totalTaskss / limit),
            tasks = await Tasks.findAll({limit, offset})
      res.json({ tasks, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single task
  .get('/task/:slug', async ({params}, res) => {
    try {
      const task =  await Tasks.findOne({
                          where: {slug: params.slug}
                        })
      res.json(task)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update task
  .put('/:tasksId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const task = await Tasks.findById(params.tasksId)

      // check permissions
      if (Tasks.UserId != UserId) return res.status(401).end()
      else res.json(await task.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create task
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      const slug = slugify(body.name)
      const task =  await Tasks.create({
                          ...body,
                          UserId,
                          slug,
                        })
      res.json(task)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })