<template>
  <div>
    <h2>Liste des utilisateurs</h2>
    <!-- Actual search box -->
    <div class="main">
      <div class="form-group has-search">
        <span class="fa fa-search form-control-feedback"></span>
        <input
          type="text"
          v-model="search"
          class="form-control"
          placeholder="Rechercher par nom d'utilisateur"
        />
      </div>
    </div>
    <a
      v-for="user in filterUsrs"
      :key="user.id"
      @click="navigateUser(user.id)"
      href="javascript:void(0)"
    >
      <card-comp>
        <h3>{{ user.firstName }} {{ user.lastName }}</h3>
        <ul>
          <li><strong>Nom d'utilisateur:</strong> {{ user.username }}</li>
        </ul>
      </card-comp>
    </a>
    <div class="bottom-div">
      <button @click="goBackHome">ACCUEIL</button>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import CardComp from "@/components/CardComp.vue"
  export default {
    name: "UsersList",
    components: {
      CardComp
    },
    data() {
      return {
        users: [],
        search: ""
      }
    },
    methods: {
      bringUsers() {
        const token = localStorage.getItem('token')
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }
        const url = "http://localhost:3000/api/users/accounts"
        axios.get(url, config)
          .then(res => console.log(this.users = res.data))
      },
      navigateUser(selectedUsrId) {
        this.$router.push(`/singleuser?id=${selectedUsrId}`)
      },
      goBackHome() {
        this.$store.commit("setSinglePostId", "")
        this.$router.push('/')
      },
    },
    computed: {
      // utilisateurs filtrés dans le v-if
      filterUsrs(){
        return this.users.filter((user)=>{
          return user.username.match(this.search)
        })
      }
    },
    created() {
      this.bringUsers()
    }
  }
</script>
<style scoped>
h2 {
  margin-bottom: 8px;
  color: var(--primaire);
}
ul,
li {
  list-style-type: none;
}
a {
  color: var(--tertiaire);
}
.bottom-div {
  margin-top: 20px;
}
.bottom-div button {
  padding: 10px 15px;
}
.main {
  width: 50%;
  margin: 50px auto;
}

.has-search .form-control {
  padding-left: 2.375rem;
}

.form-control {
  display: block;
  width: 100%;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--tertiaire);
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: var(--tertiaire);
}
.form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: var(--secondaire);
    outline: 0;
    box-shadow: 0 0 0 0.2rem #ffd7d75c;
}
</style>