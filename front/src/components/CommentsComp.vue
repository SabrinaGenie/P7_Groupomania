<template>
  <card-comp
    class="card-comp"
    v-for="comment in $store.state.comments"
    :key="comment.id"
  >
    <div class="author_data">
      <img
        v-if="comment.User.picture"
        :src="comment.User.picture"
        alt="user image"
        class="avatar"
      />
      <img v-else src="assets/user-icon.png" alt="user image" class="avatar" />
    </div>
    <div class="card-comp-content">
      <h4>Author: {{ comment.User.username }}</h4>
      <p>{{ comment.comment }}</p>
    </div>
    <div class="delete-cont">
      <button @click="deleteComment(comment)" v-if="$store.state.user.admin">
        EFFACER
      </button>
    </div>
    <!---
    <div class="dots-opt" @click="showOpts">
      <i class="fa-solid fa-ellipsis-vertical"></i>
    </div>
    
    <div class="opt-dialogue" :class="{'disp-none':opts}">
      <span>
        Report
        <i class="fa-solid fa-font-awesome"></i>
      </span>
    </div>
    --->
  </card-comp>
</template>

<script>
  import axios from 'axios'
  import CardComp from "@/components/CardComp.vue"
  export default {
    name: "CommentsComp",
    components: {
      CardComp
    },
    data() {
      return {
        opts: true,
        axiosConf: "",
        postId: "",
        owner: false
      }
    },
    methods: {
      deleteComment(comment) {
        const token = localStorage.getItem("token")
        this.axiosConf = {
          headers: { Authorization: `Bearer ${token}` }
        }
        console.log(comment.UserId)
        console.log(this.$store.state.user.userId)
        // check if owner of the post or admin

        if (confirm("supprimer ce commentaire ?")) {
          // vérifier si admin avec le backend
          axios
            .get(`http://localhost:3000/api/users/accounts/${this.$store.state.user.userId}`, this.axiosConf)
            .then((res) => {
              console.log(res.data)
              // si le backend sonfirms admin cela sera exécuté
              if (res.data.admin === true) {
                axios.delete(`http://localhost:3000/api/posts/comments/${comment.id}`, this.axiosConf)
                  .then(() => this.$store.dispatch("getComments"))
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
      this.$store.dispatch("getComments")
    }
  }
</script>

<style>
.author_data img {
  max-width: 35px;
  object-fit: contain;
}

.card-comp {
  display: flex;
  margin: 20px 10px !important;
}
.card-comp-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 13px;
  font-size: 0.8em;
  justify-content: center;
}

.dots-opt {
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
  padding: 11px 14px;
  border-radius: 50%;
  font-size: 0.9em;
}

.opt-dialogue {
  position: absolute;
  background-color: white;
  right: 30px;
  top: 18px;
  padding: 10px;
  box-shadow: 1px 2px 3px #80808069;
}

.opt-dialogue span {
  cursor: pointer;
  min-width: 117px;
  display: flex;
  align-items: center;
  padding: 10px 0;
  z-index: 10;
  justify-content: space-evenly;
}

.opt-dialogue span:hover {
  background-color: rgb(223, 221, 221);
}

.opt-dialogue .fa-solid {
  font-size: 0.8em;
}

.disp-none {
  display: none;
}

.delete-cont {
  position: absolute;
  right: 18px;
}

.delete-cont button {
  color: white;
  background: var(--primaire);
  padding: 10px 12px;
}
.delete-cont button:hover {
  color: var(--primaire);
  background-color: var(--secondaire);
}
</style>