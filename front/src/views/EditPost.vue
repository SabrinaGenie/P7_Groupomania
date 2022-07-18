<template>
  <div class="container" v-if="postData">
    <h2>MODIFIER VOTRE PUBLICATION</h2>
    <div class="form_control">
      <label>Texte de la publication :</label>
      <textarea
        @keydown="setMsg"
        maxlength="200"
        v-model.trim="postData.message"
        autocomplete="off"
      >
      </textarea>
    </div>

    <div class="form_control img-control">
      <label for="title">Image :</label>
      <input @change="checkFiles" type="file" id="title" />
    </div>

    <div class="form_control">
      <button class="btn-submit" @click="submitEditPost">ENREGISTRER LES MODIFICATIONS</button>
    </div>

    <div class="form_control">
      <button @click="this.$router.push('/')" class="btn-cancel">
        ANNULER
      </button>
    </div>
    <div class="delete">
      <button @click="deletePost" v-if="peutEffacer">EFFACER CETTE PUBLICATION</button>
    </div>
    <HomeBtnFoot />
    <ModalBody v-if="msg" @errorChange="msgChange" :msgError="msgError" />
  </div>
</template>

<script>
import axios from "axios";
import HomeBtnFoot from "@/components/HomeBtnFoot.vue";
import ModalBody from "../components/ModalBody.vue";

export default {
  name: "EditPost",
  components: {
    HomeBtnFoot,
    ModalBody,
  },
  created() {
    // check if singlePostId is found in vuex store
    if (!this.$store.state.singlePostId) {
      this.$router.push("/");
    }
    const token = localStorage.getItem("token");
    this.axiosConf = {
      headers: { Authorization: `Bearer ${token}` },
    };

    this.postId = this.$store.state.singlePostId;

    // get user's data from server
    axios
      .get(
        `http://localhost:3000/api/users/accounts/${this.$store.state.user.userId}`,
        this.axiosConf
      )
      .then((res) => {
        let usrId = res.data.id;
        // check if admin with backend
        if (res.data.admin === true) {
          // this.$router.push('/')
          this.admin = true;
          // get post data
          axios
            .get(
              `http://localhost:3000/api/posts/${this.postId}`,
              this.axiosConf
            )
            .then((postRes) => {
              console.log(postRes);
              this.postData = postRes.data;

              if (this.postAuthor.id === this.$store.state.user.userId) {
                this.owner = true;
              }
            });
          // check if user is the owner
        }
        if (this.admin == false) {
          // check if owner of post
          // gets the post data based on the params (postId)
          axios
            .get(
              `http://localhost:3000/api/posts/${this.postId}`,
              this.axiosConf
            )
            .then((postRes) => {
              console.log(postRes.data.User.id);
              if (postRes.data.User.id != usrId) {
                this.$router.push("/");
              }
              this.postData = postRes.data;
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  },
  data() {
    return {
      msg: false,
      msgError: "",
      postId: "",
      axiosConf: "",
      postData: null,
      postImg: null,
      admin: false,
      owner: false,
    };
  },
  computed: {
    peutEffacer() {
      if (this.admin) {
        return true;
      } else if (this.owner) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    msgChange() {
      this.msg = false;
      this.msgError = "";
    },
    checkFiles(e) {
      let files = e.target.files || e.dataTransfer.files;
      console.log(files[0]);
      this.postData.picture = files[0];
    },
    deletePost() {
      if (confirm("supprimer ce poste ?")) {
        // vérifier si admin avec le backend
        axios
          .get(
            `http://localhost:3000/api/users/accounts/${this.$store.state.user.userId}`,
            this.axiosConf
          )
          .then((res) => {
            console.log(res.data);
            // if backend confirms admin : cela sera exécuté
            if (res.data.admin === true) {
              console.log("ready to run ...");
              axios
                .delete(
                  `http://localhost:3000/api/posts/${this.postId}`,
                  this.axiosConf
                )
                .then(() => this.$router.push("/"))
                .catch((err) => console.log(err));
            } else {
              alert("vous n'êtes pas autorisé à exécuter cette action !");
              this.$store.dispatch("identifyUser");
            }
          });
      }
      this.$store.dispatch("getPosts");
    },
    submitEditPost() {
      if (this.postData.message === "") {
        this.msg = true;
        this.msgError = "Un des champs (email ou mot de passe) est vide !";
      }
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      if (this.postData.message === "") {
        this.msg = true;
        this.msgError = "Nous avons besoin d'une message pour votre message";
      } else if (!this.postData.picture) {
        const formData = new FormData();
        formData.append("message", this.postData.message);

        axios
          .put(
            `http://localhost:3000/api/posts/${this.postId}`,
            formData,
            config
          )
          .then((res) => {
            console.log(res);
            this.$router.push(`/singlepost?id=${this.postId}`);
          })
          .catch((err) => console.log(err));
      } else {
        // if no errors found ...
        const formData = new FormData();
        formData.append(
          "image",
          this.postData.picture,
          this.postData.picture.name
        );
        formData.append("message", this.postData.message);
        axios
          .put(
            `http://localhost:3000/api/posts/${this.postId}`,
            formData,
            config
          )
          .then((res) => {
            console.log(res);
            this.$router.push(`/singlepost?id=${this.postId}`);
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 1em;
}
.form_control textarea {
  padding: 0.5rem 0;
  background-color: #f6f6f6;
  border: 1px solid #f6f6f6;
  max-width: 745px;
}

.form_control input:focus {
  border-bottom: 1px solid var(--tertiaire);
  -webkit-box-shadow: 0 1px 0 0 var(--tertiaire);
  box-shadow: 0 1px 0 0 var(--tertiaire);
  outline: none;
  background-color: transparent;
}

.img-control {
  margin-top: 1.5em;
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

.btn-submit {
  margin-top: 40px;
}

.delete button {
  color: white;
  background: var(--primaire);
  padding: 10px 12px;
  width: 100%;
  margin-top: 30px;
  max-width: 395px;
}
.delete button:hover {
  color: var(--primaire);
  background-color: var(--secondaire);
}
</style>