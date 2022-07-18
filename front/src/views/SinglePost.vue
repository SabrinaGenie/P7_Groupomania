<template>
  <div v-if="$store.state.user">
    <h1>{{ post.message }}</h1>
    <div v-if="!post" class="card-loader">Chargement ...</div>
    <div v-else class="img-container">
      <img :src="post.imageURL" alt="" />
    </div>
    <p>{{ post.body }}</p>

    <div class="author_data">
      <h4>
        Auteur:
        <a @click="navigateUser" href="javascript:void(0)">{{
          postAuthor.name
        }}</a>
      </h4>
      <a @click="navigateUser" href="javascript:void(0)">
        <img :src="postAuthor.picture" alt="post image" />
      </a>
    </div>
    <div class="likes">Likes: {{ likesNo }}</div>

    <div class="delete">
      <button @click="deletePost" v-if="$store.state.user.admin">
        EFFACER
      </button>
      <button
        class="edit-btn"
        @click="$router.push('/editpost')"
        v-if="$store.state.user.admin || owner"
      >
        ÉDITER
      </button>
    </div>

    <div class="actions">
      <div class="like-btns">
        <span @click="likePost">
          <i
            class="fa-solid fa-thumbs-up"
            :class="[liked ? 'liked' : 'normal']"
          ></i>
        </span>
      </div>

      <div>
        <button @click="goBackHome">ACCUEIL</button>
      </div>
    </div>
    <NewCommentsComp />
  </div>
</template>

<script>
  // dependencies for the requests ( POST et GET )
  import axios from 'axios'
  import NewCommentsComp from "@/components/NewCommentComp.vue"

  export default {
    name: "SinglePost",
    components: {
      NewCommentsComp
    },
    data() {
      return {
        post: {},
        liked: false,
        likesNo: 0,
        postId: '',
        axiosConf: "",
        postAuthor: {},
        owner: false
      }
    },
    methods: {
      likePost() {
        axios.post(`http://localhost:3000/api/posts/${this.postId}/likes`,
          {
            postId: this.postId
          },
          this.axiosConf)
          .then((response) => {
            // success
            // console.log(response.data.msg)
            // check if liked or not
            if (response.data.msg === "Post liké") {
              this.liked = true
              this.likesNo++
            } else {
              this.liked = false
              this.likesNo--
            }
          })
          .catch((error) => {
            // error
            console.log(error)
          })

      },
      goBackHome() {
        this.$store.commit("setSinglePostId", "")
        this.$router.push('/')
      },
      navigateUser() {
        this.$router.push(`/singleuser?id=${this.postAuthor.id}`)
      },
      deletePost() {
        if (confirm("supprimer ce poste ?")) {
          // vérifier si cmpte admin avec le backend
          axios
            .get(`http://localhost:3000/api/users/accounts/${this.$store.state.user.userId}`, this.axiosConf)
            .then((res) => {
              console.log(res.data)
              // si le backend sonfirms admin : cela sera exécuté
              if (res.data.admin === true) {
                console.log("ready to run ...")
                axios.delete(`http://localhost:3000/api/posts/${this.postId}`, this.axiosConf)
                  .then(() => this.$router.push('/'))
                  .catch(err => console.log(err))
              } else {
                alert("vous n'êtes pas autorisé(e) à exécuter cette action !")
                this.$store.dispatch("identifyUser")
              }
            })
        }
      }
    },
    created() {
      const token = localStorage.getItem("token")
      this.axiosConf = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // get post ID and sends it as a param to the backend
      // get post ID using $route query
      this.postId = this.$route.query.id

      this.$store.commit("setSinglePostId", this.postId)
      // gets the post data based on the params (postId)
      axios.get(`http://localhost:3000/api/posts/${this.postId}`, this.axiosConf)
        .then((response) => {
          // success
          // console.log(response.data)
          this.likesNo = response.data.Likes.length
          this.post = response.data
          // checks if user liked the post and shows the blue thumb-up
          if (response.data.Likes) {
            response.data.Likes.forEach(like => {
              if (like.UserId === this.$store.state.user.userId) {
                this.liked = true
              }
            })
          }
          // post author ( Vue bug ? )
          // if try to use directly in template gives an error ... 
          this.postAuthor.name = response.data.User.username
          this.postAuthor.id = response.data.User.id
          this.postAuthor.picture = response.data.User.picture
          // user icon/avatar
          if (this.postAuthor.picture === null) {
            this.postAuthor.picture = "assets/user-icon.png"
          }
          // post image
          if (response.data.imageURL === null) {
            this.post.imageURL = "./assets/icon-left-font.png"
          }
          // check if user is the owner
          if (this.postAuthor.id === this.$store.state.user.userId) {
            this.owner = true
          }

        })
        .catch((error) => {
          // error
          console.log(error)
          if (error.message === "Request failed with status code 401") {
            this.$router.push("/login")
          }
        })

    }
  }
</script>

<style scoped>
p {
  margin: 1em;
}
h4 {
  margin: 1em 0.5em;
  text-align: right;
}

span {
  padding: 0.65em;
  background-color: #f6f6f6;
  cursor: pointer;
  margin-right: 10px;
}
span:hover {
  background-color: rgba(206, 206, 206, 0.76);
}
.fa-solid {
  font-size: 1.5em;
}

.like-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.liked {
  color: #185df2;
}

.normal {
  color: var(--tertiaire);
}

.actions {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

button {
  margin: 1.2em;
  height: 40px;
  width: 83px;
}

.img-container {
  max-width: 200px;
  margin: auto;
  margin-top: 1em;
  overflow: hidden;
}

.card-loader {
  height: 350px;
  width: 200px;
  margin-top: -40px;
  margin: auto;
  display: flex;
  background-color: rgba(197, 197, 197, 0.712);
  align-items: center;
  justify-content: center;
  align-content: center;
}

.author_data {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}

.author_data img {
  max-width: 35px;
  object-fit: contain;
  border-radius: 50%;
}

.author_data a {
  color: var(--primaire);
}

.likes {
  text-align: right;
  font-size: 0.8em;
  padding-right: 10px;
}
.delete {
  margin: 1em;
}
.delete button {
  color: white;
  background: var(--primaire);
  padding: 10px 12px;
  width: fit-content;
}
.delete button:hover {
  color: var(--primaire);
  background-color: var(--secondaire);
}

.delete .edit-btn {
  background-color: var(--tertiaire);
  border: 1px solid var(--tertiaire);
}
.delete .edit-btn:hover {
  background-color: rgb(32, 32, 32);
  color: white;
}
</style>