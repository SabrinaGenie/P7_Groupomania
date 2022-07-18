import { createStore } from 'vuex'
// dependencies for the requests ( POST et GET )
import axios from 'axios'

export default createStore({
	state: {
		user: null,
		posts: [],
		comments: [],
		singlePostId: '',
		token: '',
		error: '',
	},
	getters: {
		getSnglePostId: (state) => () => {
			return state.singlePostId
		},
	},
	mutations: {
		setUser(state, userData) {
			state.user = userData
		},
		setToken(state, token) {
			state.token = token
		},
		logOut(state) {
			state.user = null
			localStorage.clear()
			state.token = ''
			state.posts = []
			state.comments = []
		},
		setPosts(state, postsData) {
			state.posts = postsData
		},
		setComments(state, comments) {
			state.comments = comments
			// console.log(comments)
		},
		setSinglePostId(state, postId) {
			state.singlePostId = postId
		},
	},
	actions: {
		checkUser() {},
		identifyUser({ commit }) {
			const userId = localStorage.getItem('src')
			const token = localStorage.getItem('token')
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			}
			axios
				.get(`http://localhost:3000/api/users/accounts/${userId}`, config)
				.then((res) => {
					// define user
					let usr = {
						userId: res.data.id,
						firstName: res.data.firstName,
						lastName: res.data.lastName,
						picture: res.data.picture,
						username: res.data.username,
						email: res.data.email,
						admin: res.data.admin,
					}
					commit('setUser', usr)
				})
		},
		getPosts({ commit }) {
			const token = localStorage.getItem('token')
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			}

			axios
				.get('http://localhost:3000/api/posts/', config)
				.then((response) => {
					// success
					console.log(response.data)
					commit('setPosts', response.data)
				})
				.catch((error) => {
					// error
					console.log(error.message)
				})
		},
		getComments({ commit, getters }) {
			const token = localStorage.getItem('token')
			const config = {
				headers: { Authorization: `Bearer ${token}` },
			}

			axios
				.get(
					`http://localhost:3000/api/posts/${getters.getSnglePostId()}/comments`,
					config
				)
				.then((res) => {
					// console.log(res.data, getters.getSnglePostId())
					commit('setComments', res.data)
				})
		},
	},
})
