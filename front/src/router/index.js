import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/LogIn.vue'),
	},
	{
		path: '/signup',
		name: 'signip',
		component: () => import('../views/SignUp.vue'),
	},
	{
		path: '/newpost',
		name: 'newpost',
		component: () => import('../views/NewPost.vue'),
	},
	{
		path: '/singlepost',
		name: 'singlepost',
		component: () => import('../views/SinglePost.vue'),
	},
	{
		path: '/singleuser',
		name: 'singleuser',
		component: () => import('../views/SingleUser.vue'),
	},
	{
		path: '/edituser',
		name: 'edituser',
		component: () => import('../views/EditUser.vue'),
	},
	{
		path: '/userslist',
		name: 'userslist',
		component: () => import('../views/UsersList.vue'),
	},
	{
		path: '/editpost',
		name: 'editpost',
		component: () => import('../views/EditPost.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
