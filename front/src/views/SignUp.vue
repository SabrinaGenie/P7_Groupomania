<template>
  <div class="container">
    <div class="card">
      <h2>CRÉER UN COMPTE</h2>

      <div class="form_control">
        <label for="firstName">Prénom</label>
        <input v-model="firstName" type="text" id="firstName" />
      </div>

      <div class="form_control">
        <label for="lastName">Nom</label>
        <input v-model="lastName" type="text" id="lastName" />
      </div>

      <div class="form_control">
        <label for="username">Nom d'utilisateur</label>
        <input v-model="username" type="text" id="username" />
      </div>

      <div class="form_control">
        <label for="email">Adresse email</label>
        <input v-model="email" type="email" id="email" />
      </div>

      <div class="form_control">
        <label for="password">Mot de passe</label>
        <input v-model="password" type="password" id="password" />
      </div>

      <div class="form_control">
        <button @click="handleSubmit">S'ENREGISTRER !</button>
      </div>

      <div class="right-line"></div>
    </div>
    <ModalBody v-if="error" :msgError="msgError" @errorChange="errorChange" />
  </div>
</template>
<script>
// dependencies for the requests ( POST et GET )
import axios from "axios";
import ModalBody from "../components/ModalBody.vue";
export default {
  name: "SignUp",
  components: {
    ModalBody,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      error: false,
      msgError: "",
    };
  },
  methods: {
    handleSubmit() {
      axios
        .post("http://localhost:3000/api/users/auth/signup", {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          console.log(response);
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
          this.error = true;
          this.handleError(error);
        });
    },
    handleError(error) {
      this.msgError = error.response.data;
    },
    errorChange() {
      this.error = false;
    },
  },
};
</script>

<style scoped>
h2 {
  text-transform: uppercase;
  margin-top: 20px;
  margin-bottom: 40px;
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
</style>