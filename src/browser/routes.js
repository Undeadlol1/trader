import Layout from './pages/Layout';
import IndexPage from './pages/IndexPage';
import UserPage from './pages/UserPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import store from 'browser/redux/store'
import { fetchMoods, fetchMood } from 'browser/redux/actions/MoodActions'
import { fetchUser, fetchCurrentUser  } from 'browser/redux/actions/UserActions'
import { fetchNodes, actions as nodeActions } from 'browser/redux/actions/NodeActions'
import {
  fetchForum,
  fetchForums,
  fetchThread,
  fetchThreads,
} from 'browser/redux/forum/ForumActions'
import {
  fetchTask,
  fetchTasks,
} from 'browser/redux/task/TaskActions'
/**
 * fetching is done in router config in order to properly prefetch data in SSR
 */

const routesConfig = {
  path: '/',
  component: Layout,
  onEnter({params}, replace, done) {
    // check if fetching is needed
    const userId = store.getState().user.get('id')
    if (userId) return done()
    else {
      store
      .dispatch(fetchCurrentUser())
      .then(() => done())
    }
  },
  indexRoute: {
    component: IndexPage,
    // fetch data
    onEnter({params}, replace, done) {
      // fetch data every 10 seconds
      const interval = 1000 * 10
      setInterval(
        () => store.dispatch(fetchTasks()),
        interval
      )
      // and fetch once immediately
      store
      .dispatch(fetchTasks())
      .then(() => done())
    }
  },
  childRoutes: [
    {
      path: 'users/(:username)',
      component: UserPage,
      onEnter({params}, replace, done) {
        const fetchedUserId = store.getState().user.getIn(['fetchedUser', 'id'])
        // check if fetching is needed
        // TODO change username to userId
        if (fetchedUserId == params.username) return done()
        else {
          store
          .dispatch(fetchUser(params.username))
          .then(() => done())
        }
      }
    },
    { path: 'search', component: SearchPage },
    { path: 'about', component: AboutPage },
    {
      path: 'forums/(:forumSlug)',
      component: require('browser/pages/ForumPage').default,
      onEnter({params}, replace, done) {
        const { forumSlug } = params
        const fetchedForum = store.getState().forum
        // check if fetching is needed
        if (fetchedForum.get('slug') == forumSlug) return done()
        else {
          store
          .dispatch(fetchForum(forumSlug))
          .then(() => done())
        }
      }
    },
    {
      path: 'threads/(:threadSlug)',
      component: require('browser/pages/ThreadPage').default,
      // fetch data
      onEnter({params}, replace, done) {
        const { threadSlug } = params
        const fetchedSlug = store
                              .getState()
                              .forum
                              .getIn(['thread', 'slug'])
        // check if fetching is needed
        if (fetchedSlug == threadSlug) return done()
        else {
          console.log('else is running')
          store
          .dispatch(fetchThread(threadSlug))
          .then(() => done())
        }
      }
    },
{
  path: 'forum',
  component: require('browser/pages/ForumsPage').default,
  onEnter({params}, replace, done) {
    // check if fetching is needed
    const fetchedForums = store.getState().forum.getIn(['forums', 'values'])
    if (fetchedForums.size) return done()
    else {
      store
      .dispatch(fetchForums())
      .then(() => done())
    }
  }
},
{
  path: 'tasks/(:id)',
  component: require('browser/pages/TaskPage').default,
  onEnter({params}, replace, done) {
      // fetch data every 10 seconds
      const interval = 1000 * 10
      setInterval(
        () => store.dispatch(fetchTask(params.id)),
        interval
      )
      // and fetch once immediately
      store
      .dispatch(fetchTask(params.id))
      .then(() => done())
  }
},
  // ⚠️ Hook for cli! Do not remove 💀,
    // 404 page must go after everything else
    { path: '*', component: NotFound },
  ]
}

module.exports = routesConfig;