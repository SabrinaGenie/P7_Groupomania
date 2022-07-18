<template>
  <div class="container">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {};
  },
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
  created() {
    // check if there's a logged user

    if (localStorage.getItem("token")) {
      // console.log("theres a token !")
      // s'il y a un token, nous essaierons d'identifier l'utilisateur correspondant
      this.$store.dispatch("identifyUser");
      // sets token var to the store state "token"
      this.$store.commit("setToken", localStorage.getItem("token"));
    } else {
      if (!this.$store.state.user) {
        this.$router.push("/login");
      }
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap");
:root {
  --primaire: #fd2d01;
  --secondaire: #ffd7d7;
  --tertiaire: #4e5166;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  max-width: 650px;
  margin: 0 auto;
  margin-top: 3.7em;
}

.logo-cont {
  max-width: 47px;
  margin-left: 0.8em;
}
#app {
  font-family: "Lato", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--tertiaire);
}

h2 {
  margin-bottom: 8px;
  color: var(--primaire);
}

a {
  text-decoration: none;
  font-weight: 700;
}

a:active {
  font-weight: 700;
}

img {
  width: 100%;
}
.card {
  position: relative;
  margin: 0.5rem 0 1rem 0;
  padding: 0.8rem;
  background-color: #fff;
  -webkit-transition: -webkit-box-shadow 0.25s;
  transition: -webkit-box-shadow 0.25s;
  transition: box-shadow 0.25s;
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%),
    0 1px 5px 0 rgb(0 0 0 / 20%);
}

.form_control {
  display: flex;
  flex-direction: column;
  max-width: 395px;
  margin: auto;
}

.form_control input,
.form_control textarea {
  padding: 0.8em 0.5rem;
  background-color: #f6f6f6;
  border: 1px solid #f6f6f6;
  border-bottom: 1px solid #737070;
  max-width: 745px;
  transition: background-color 0.3s, border 0.3s, 0.3s;
}

.form_control input:focus {
  border-bottom: 1px solid var(--tertiaire);
  -webkit-box-shadow: 0 1px 0 0 var(--tertiaire);
  box-shadow: 0 1px 0 0 var(--tertiaire);
  outline: none;
  background-color: transparent;
}

.disabled {
  color: #9f9f9f !important;
  cursor: default;
  pointer-events: none;
  background-color: #dfdfdf !important;
  border: 1px solid transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.form_control textarea:focus {
  border-bottom: 1px solid var(--tertiaire);
  -webkit-box-shadow: 0 1px 0 0 var(--tertiaire);
  box-shadow: 0 1px 0 0 var(--tertiaire);
  outline: none;
  background-color: transparent;
}

button {
  background-color: #ffd7d7;
  border: 1px solid #ffd7d7;
  padding: 0.5rem 0;
  cursor: pointer;
  box-shadow: 0 3px 3px 0 rgb(0 0 0 / 14%), 0 1px 7px 0 rgb(0 0 0 / 12%),
    0 3px 1px -1px rgb(0 0 0 / 20%);
  color: rgba(0, 0, 0, 0.6);
  transition: 0.3s ease-out;
}

button:hover {
  box-shadow: 0 0px 1px 0 rgb(0 0 0 / 14%), 0 1px 7px 0 rgb(0 0 0 / 12%),
    0 3px 1px -1px rgb(0 0 0 / 20%);
  background-color: #f3b7b7;
  border: 1px solid #f3b7b7;
}

.btn-cancel {
  margin-top: 40px;
  background-color: #f0eaea;
  border: 1px solid #f0eaea;
}
</style>
