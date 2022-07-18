<template>
  <div class="container">
    <img src="@/assets/icon-above-font.png" alt="grupomania social network" />
    <div class="card">
      <h2>VOUS CONNECTER</h2>
      <div class="form_control">
        <label for="email">Adresse email</label>
        <input v-model="email" type="email" id="email" />
      </div>

      <div class="form_control">
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" />
      </div>

      <div class="form_control">
        <button @click="handleSubmit">SE CONNECTER !</button>
      </div>
      <div class="right-line"></div>
      <ModalBody v-if="msg" @errorChange="msgChange" :msgError="msgError" />
    </div>
  </div>
</template>
 
<script>
  import axios from 'axios'
  import ModalBody from '@/components/ModalBody.vue'

  export default {
    name: "LogIn",
    components: {
      ModalBody
    },
    data() {
      return {
        email: "",
        password: "",
        msg: false,
        msgError: "",
      }
    },
    methods: {
      msgChange() {
        this.msg = false
        this.msgError = ""
      },
      handleSubmit() {
        if (this.email === "") {
          this.msg = true
          this.msgError = "Un des champs (email ou mot de passe) est vide !"
        } else {
          axios.post('http://localhost:3000/api/users/auth/login', {
            email: this.email,
            password: this.password
          })
            .then((response) => {
              // console.log(response.data)
              localStorage.setItem('token', response.data.token)
              localStorage.setItem('src', response.data.userData.userId)
              this.$store.commit('setUser', response.data.userData)
              this.$store.commit("setToken", localStorage.getItem("token"))
              this.$router.push("/")

            })
            .catch((error) => {
              console.log(error)
              this.msg = true
              this.handleError(error)
            })
        }
      },
      handleError(error) {
        this.msgError = error.response.data.error
      },
      errorChange() {
        this.error = false
      }
    }
  }
</script>
 
<style scoped>
h2 {
  text-transform: uppercase;
  margin-top: 20px;
  margin-bottom: 40px;
}

input {
  margin-bottom: 2em;
}

label {
  color: rgba(0, 0, 0, 0.6);
  text-align: left;
}
button {
  margin-bottom: 35px;
  margin-top: 30px;
}

.card {
  position: relative;
}
.right-line {
  background-color: var(--primaire);
  border-right: var(--primaire);
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  width: 5.6%;
  border-radius: 0px 2px 2px 0;
}

img {
  max-width: 96px;
}
</style>
