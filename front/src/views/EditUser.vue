<template>
  <h2>MON COMPTE</h2>
  <card-comp>
    <div class="img-container">
      <img :src="user.picture" alt="user image" />
      <h3>{{ user.firstName }} {{ user.lastName }}</h3>
      <h4>Nom d'utilisateur : {{ user.username }}</h4>
      <p>Email: {{ user.email }}</p>
      <p v-if="user.description" class="user_descipt">{{ user.description }}</p>
    </div>
    <div class="act-btns">
      <button @click="this.$router.push('/')" class="btn-cancel">ACCUEIL</button>
      <button @click="msg = true" class="btn-edit">
        MODIFIER
        <i class="fa-solid fa-pencil"></i>
      </button>
    </div>
  </card-comp>
  <modal-body v-if="msg" :msgError="msgError" @errorChange="msgChange">
    <h3>Edit profile</h3>
    <form @submit.prevent="handleSbmit">
      
      <div class="form_control">
        <label>Profile pic</label>
        <input @change="checkFiles" type="file" />
      </div>

      <div class="form_control">
        <label>Description</label>
        <input v-model="data.description" type="text" />
      </div>

      <div class="form_control">
        <label>Username</label>
        <input v-model="data.username" type="text" />
      </div>

      <button class="btn-submit" type="submit">Submit</button>
    </form>
  </modal-body>
</template>
<script>
  import CardComp from "@/components/CardComp.vue"
  import ModalBody from "../components/ModalBody.vue"
  import axios from 'axios'
  export default {
    name: "EditUser",
    data() {
      return {
        user: {},
        msg: false,
        userId: "",
        msgError: "",
        // data to sent to server
        data: {}

      }
    },
    components: {
      CardComp,
      ModalBody
    },
    watch: {
      user: function () {
        if (this.user) {
          if (this.user.picture === null) {
            this.user.picture = "assets/user-icon.png"
          }
        }
      }
    },
    methods: {
      msgChange() {
        this.msg = false
      },
      handleSbmit() {
        // this.$store.dispatch("userUpdate", this.data)
        console.log(this.data)
        this.updloadData()
      },
      checkFiles(e) {
        let files = e.target.files || e.dataTransfer.files
        console.log(files[0])
        this.data.picture = files[0]
      },
      updloadData() {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
        const formData = new FormData()
        // append data to send to backend if it exists
        if (this.data.picture) {
          formData.append("image", this.data.picture, this.data.picture.name)
        }
        if (this.data.description) {
          formData.append("description", this.data.description)
        }
        if (this.data.username) {
          formData.append("username", this.data.username)
        }
        // this.data.picture = formData
        axios.put(`http://localhost:3000/api/users/accounts/${this.userId}`, formData, config)
          // falta evaluar error
          .then(res => {
            console.log(res)
            this.$store.dispatch("identifyUser")
            this.userData()
          })
          .catch(err => console.log(err))
          .finally(()=> this.msg = false)
      },
      userData() {
        // get user ID using $route query
        this.userId = this.$route.query.id
        const config = {
          headers: { Authorization: `Bearer ${this.$store.state.token}` },
        }
        axios.get(`http://localhost:3000/api/users/accounts/${this.userId}`, config)
          .then(res => {
            // console.log(res.data)
            this.user = res.data
          })
      }
    },

    created() {
      this.userData()
    }
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

.btn-edit {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-evenly;
}

.btn-submit{
  margin-top: 40px;
  margin-bottom: 20px;
}

.user_descipt {
  padding: 0.8em 1.2em;
  background-color: #585a6b;
  margin: 10px auto;
  max-width: fit-content;
}
</style>