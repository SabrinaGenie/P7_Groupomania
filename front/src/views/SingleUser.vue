<template>
  <h2>COMPTE UTILISATEUR</h2>
  <card-comp>
    <div class="img-container">
      <img :src="userImg" alt="user image" />
      <h3>{{ user.firstName }} {{ user.lastName }}</h3>
      <h4>Nom d'utilisateur: {{ user.username }}</h4>
      <p>Email: {{ user.email }}</p>
      <p v-if="user.description" class="user_descipt">{{ user.description }}</p>
    </div>
  </card-comp>
  <div class="delete">
    <button @click="deleteComment" v-if="$store.state.user.admin">
      EFFACER L'UTILISATEUR
    </button>
  </div>

  <div>
    <button @click="goBackHome">RETOUR</button>
  </div>
</template>
<script>
  import CardComp from "@/components/CardComp.vue"
  import axios from 'axios'
  export default {
    name: "SingleUser",
    data() {
      return {
        user: {},
        owner: false,
        msg: false,
        userId: {},
        msgError: "",
        data: {
          description: "",
          picture: ""
        }
      }
    },
    components: {
      CardComp
    },
    methods: {
      msgChange() {
        this.msg = false
      },
      handleSbmit() {
        this.$store.dispatch("userUpdate")
        console.log(this.checkFiles())
      },
      checkFiles(e) {
        let files = e.target.files || e.dataTransfer.files
        console.log(files[0])
      },
      goBackHome() {
        this.$store.commit("setSinglePostId", "")
        this.$router.push('/userslist')
      },
      deleteComment() {
        const token = localStorage.getItem("token")
        this.axiosConf = {
          headers: { Authorization: `Bearer ${token}` }
        }
        console.log(this.userId)
        console.log(this.$store.state.user.userId)
        // check if owner of the post or admin

        if (confirm("supprimer cet utilisateur ?")) {
          // vérifier si admin avec le backend
          axios
            .get(`http://localhost:3000/api/users/accounts/${this.$store.state.user.userId}`, this.axiosConf)
            .then((res) => {
              console.log(res.data)
              // si le backend sonfirms admin cela sera exécuté
              if (res.data.admin === true) {
                axios.delete(`http://localhost:3000/api/users/accounts/${this.userId}`, this.axiosConf)
                  .then(() => this.$router.push('/userslist'))
                  .catch(err => console.log(err))
              } else {
                alert("vous n'êtes pas autorisé à exécuter cette action !")
                this.$store.dispatch("identifyUser")
              }
            })
        }
      }

    },
    created() {
      // get post ID and sends it as a param to the backend
      // get user ID using $route query
      this.userId = this.$route.query.id
      const config = {
        headers: { Authorization: `Bearer ${this.$store.state.token}` },
      }
      axios.get(`http://localhost:3000/api/users/accounts/${this.userId}`, config)
        .then(res => {
          console.log(res.data)
          this.user = res.data
        })

    },
    computed: {
      userImg() {
        if (this.user) {
          if (this.user.picture === null) {
            return "assets/user-icon.png"
          }
          return this.user.picture
        } else {
          return null
        }

      },
      createImg(e) {
        return this.createImage(e)
      }
    },
  }
</script>
<style scoped>
.img-container {
  background-color: var(--tertiaire);
  border-radius: 10px 0 0 10px;
  padding: 15px;
  width: 101%;
  color: white;
}
.img-container img {
  max-width: 150px;
  background-color: white;
  border-radius: 50%;
  border: 1px solid white;
  padding: 1px;
}

.img-container div {
  position: relative;
}
.img-container .fa-camera {
  position: absolute;
  top: 109px;
  color: var(--primaire);
  background: rgba(255, 255, 255, 0.123);
  padding: 0.7em;
  border-radius: 2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

.img-container .fa-camera:hover {
  color: var(--tertiaire);
}
.details-cont {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  gap: 15px;
  margin: auto;
}
h3,
h4 {
  font-weight: normal;
  margin-top: 1em;
  margin-bottom: 1em;
}

.details-cont span {
  cursor: pointer;
}

.details-cont span:hover {
  color: var(--primaire);
}

.act-btns {
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
}
button {
  padding: 0.8em 1.2em;
  min-width: 82px;
}
.btn-submit {
  margin-top: 40px;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-evenly;
}

.user_descipt {
  padding: 0.8em 1.2em;
  background-color: #585a6b;
  margin: 10px auto;
  max-width: fit-content;
}
.delete{
  margin: 1em;
}
.delete button {
  color: white;
  background: var(--primaire);
  padding: 10px 12px;
}
.delete button:hover {
  color: var(--primaire);
  background-color: var(--secondaire);
}
</style>