<template>
  <div v-if="$store.state.user === null">
    <h2>Vous n'êtes pas connecté(e)</h2>
  </div>
  <div class="container" v-if="$store.state.user != null">
    <div class="card">
      <h2>Nouvelle publication</h2>
      <div class="form_control">
        <label>Texte de votre publication :</label>
        <textarea @keydown="setMsg" maxlength="200" autocomplete="off">
        </textarea>
      </div>

      <div class="form_control img-control">
        <label for="title">Image de votre publication :</label>
        <input @change="checkFiles" type="file" id="title" />
      </div>

      <div class="form_control">
        <button class="btn-submit" @click="submitNewPost">ENREGISTRER</button>
      </div>

      <div class="form_control">
        <button @click="this.$router.push('/')" class="btn-cancel">
          ANNULER
        </button>
      </div>
      <div class="right-line"></div>
      <ModalBody v-if="msg" @errorChange="msgChange" :msgError="msgError" />
    </div>
    <LoaderComp v-if="loading" />
  </div>
</template>

<script>
import axios from "axios";
import ModalBody from "../components/ModalBody.vue";
import LoaderComp from "../components/LoaderComp.vue";

export default {
  name: "NewPost",
  components: {
    ModalBody,
    LoaderComp,
  },
  data() {
    return {
      loading: false,
      msg: false,
      msgError: "",
      ready: false,
      // data to sent to server
      newPostData: {},
    };
  },
  methods: {
    msgChange() {
      this.msg = false;
      this.msgError = "";
    },
    checkFiles(e) {
      this.loading = true;
      let files = e.target.files || e.dataTransfer.files;
      console.log(files[0]);
      this.newPostData.picture = files[0];
      this.loading = false;
    },
    setMsg(e) {
      // text min 2 characters
      if (e.target.value.length > 10) {
        this.newPostData.message = e.target.value;
      }
    },
    submitNewPost() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const url = "http://localhost:3000/api/posts/add";
      // check for errors
      // append data to send to backend if it exists
      if (!this.newPostData.message) {
        this.msg = true;
        this.msgError = "Nous avons besoin d'une message pour votre message";
      } else if (!this.newPostData.picture) {
        if (confirm("Ce poste n'a pas d'image. Continuer quand même ?")) {
          console.log("sending with no pic");
          const formData = new FormData();
          formData.append("message", this.newPostData.message);

          axios
            .post(url, formData, config)
            .then((res) => {
              console.log(res);
              this.$router.push("/");
            })
            .catch((err) => console.log(err));
        }
      } else {
        // if no errors found ...
        const formData = new FormData();
        formData.append(
          "image",
          this.newPostData.picture,
          this.newPostData.picture.name
        );
        formData.append("message", this.newPostData.message);

        axios
          .post(url, formData, config)
          .then((res) => {
            console.log(res);
            this.$router.push("/");
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>

<style scoped>
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
</style>