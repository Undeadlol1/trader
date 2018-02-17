import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { setInterval } from 'timers'
import { Tasks, Logs } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'
import { handleTasks, handleOrders } from 'server/bot/handleTasks'
import { fetchPricesAndSave, fetchBalance, fetchOpenOrders } from 'server/bot/binanceApi'

const limit = 12
const interval = 1000 * 30 * 2 // 1 minute minimum to avoid timeout

/*
order example:
{ symbol: 'ETHBTC',
[1]     orderId: 62349512,
[1]     clientOrderId: 'IMNw6qh6dJb9l8HQVzgK0C',
[1]     price: '0.08900000',
[1]     origQty: '6.44400000',
[1]     executedQty: '0.00000000',
[1]     status: 'NEW',
[1]     timeInForce: 'GTC',
[1]     type: 'LIMIT',
[1]     side: 'BUY',
[1]     stopPrice: '0.00000000',
[1]     icebergQty: '0.00000000',
[1]     time: 1516835193760,
[1]     isWorking: true },
*/

if (process.env.NODE_ENV != 'test') {
  setInterval(async () => {
    try {
      console.log('interval is running')
      // fetch data
      await fetchPricesAndSave()
      // await fetchBalance()
      // TODO: i disabled this temporary
      // global.orders = await fetchOpenOrders()
      // check if there are active tasks
      const activeTasks = await Tasks.findAll({where: {isDone: false}})
      // handle tasks if there are any
      if (activeTasks) {
        // 'handleTasks' returns orders
        await handleOrders(
          await Promise.all(await handleTasks(activeTasks))
        )
      }
    } catch (error) {
      throw error
    }
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
      res.json({ values: tasks, totalPages, currentPage: page })

    }
    catch (error) {
      res.status(500).end(error)
    }
  })

  // get single task
  .get('/task/:id', async ({params}, res) => {
    try {
      const task = await Tasks.findById(params.id, {raw: true})
      const logs = await Logs.findAll({
        limit: 10,
        raw: true,
        where: {TaskId: params.id},
      })
      res.json({logs: {values: logs}, ...task})
    } catch (error) {
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
      res.status(500).end(error)
    }
  })

  // create task
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      const task =  await Tasks.create({...body, UserId})
      res.json(task)
    } catch (error) {
      res.status(500).end(error)
    }
  })

  // delete task
  .delete('/:id', mustLogin, async ({user, body, params}, res) => {
    try {
      const task = await Tasks.findById(params.id)
      // document was not found
      if (!task) return res.status(204).end()
      // user must be documents owner to delete it
      if (task && task.UserId == user.id) {
        await task.destroy()
        await res.status(200).end()
      }
      else res.boom.unauthorized('You must be the owner to delete this')
    } catch (error) {
      res.status(500).end(error)
    }
  })