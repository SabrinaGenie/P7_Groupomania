<template>
  <div>
    <i @click="toggleBar" class="fa-solid fa-bars"></i>
  </div>
  <div class="nav-cont" v-if="showBar">
    <i @click="toggleBar" class="fa-solid fa-xmark"></i>
    <div class="logo-cont">
      <router-link @click="this.$store.commit('setSinglePostId', '')" to="/">
        <img src="@/assets/icon.png" alt="avatar" />
      </router-link>
    </div>
    <nav>
      <ul>
        <li>
          <router-link
            @click="
              this.$store.commit('setSinglePostId', '');
              toggleBar();
            "
            to="/"
            >Accueil</router-link
          >
        </li>
        <li @click="toggleBar" v-if="$store.state.user === null">
          <router-link to="/login">Se connecter</router-link>
        </li>

        <li @click="toggleBar" v-if="$store.state.user === null">
          <router-link to="/signup">Créer un compte</router-link>
        </li>
        <li @click="toggleBar" v-if="$store.state.user != null">
          <router-link to="/newpost">Nouvelle publication</router-link>
        </li>
        <li @click="toggleBar" v-if="$store.state.user != null">
          <router-link to="/userslist">Utilisateurs</router-link>
        </li>
        <li @click="toggleBar" v-if="$store.state.user != null">
          <span @click="logOutCommit">Se déconnecter</span>
        </li>
        <li @click="toggleBar" v-if="$store.state.user != null">
          <router-link :to="`/edituser?id=${$store.state.user.userId}`">
            <img
              v-if="$store.state.user.picture"
              :src="$store.state.user.picture"
              alt="user image"
              class="avatar"
            />
            <img v-else :src="user.picture" alt="user image" class="avatar" />
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    name: "NavBar",
    data() {
      return {
        user: {
          picture: "assets/user-icon.png"
        },
        showBar: false
      }
    },
    methods: {
      logOutCommit() {
        this.$router.push("/login")
        this.$store.commit('logOut')
      },
      toggleBar() {
        this.showBar = !this.showBar
      }
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
  }
</script>

<style scoped>
img {
  max-width: 35px;
}

ul:not(.browser-default) > li {
  list-style-type: none;
}
.fa-xmark {
  position: absolute;
  right: 0.8em;
  font-size: 1.5em;
  padding: 2px;
  top: 0.7em;
  cursor: pointer;
}
.fa-bars {
  position: absolute;
  top: 1em;
  font-size: 1.9em;
  left: 1em;
  cursor: pointer;
}
.nav-cont {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1050;
  background: white;
  position: fixed;
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%),
    0 1px 5px 0 rgb(0 0 0 / 20%);
  height: 100%;
  top: 0;
  left: 0;
}

.logo-cont {
  margin-top: 1em;
}

.nav-cont li {
  margin-bottom: 1.6em;
  border-bottom: 1px solid #c9c4c4;
  padding-bottom: 1em;
}

.nav-cont li:last-child {
  border-bottom: 1px solid transparent;
}
nav {
  padding: 25px 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}

nav a.router-link-exact-active {
  color: var(--primaire);
}

nav span {
  font-weight: bold;
  cursor: pointer;
}

.avatar {
  border-radius: 50%;
  border: 0.5px solid var(--tertiaire);
}

@media (min-width: 650px) {
  .nav-cont {
    max-width: 300px;
  }
}
</style>