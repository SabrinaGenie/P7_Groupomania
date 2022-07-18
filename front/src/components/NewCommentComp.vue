<template>
  <div class="comments">
    <h4>Commentaires</h4>
    <div>
      <div class="user_data">
        <img src="@/assets/user-icon.png" alt="ok" />
        <h4>{{ $store.state.user.username }}</h4>
      </div>
      <div class="form_control">
        <input
          v-model="comment"
          type="text"
          @keyup="checkValidComm"
          placeholder="Laisser un commentaire"
        />
      </div>
      <div class="action_btns">
        <button @click="comment = ''" class="btn-sec">Annuler</button>
        <button
          :class="{ disabled: !validComment }"
          @click="handleCommentSumit"
        >
          Commenter
        </button>
      </div>
      <CommentsComp />
    </div>
  </div>
</template>

<script>
// dependencies pour le requests ( POST et GET )
import axios from "axios";
import CommentsComp from "@/components/CommentsComp.vue";

export default {
  name: "NewComentComp",
  components: {
    CommentsComp,
  },
  data() {
    return {
      axiosConf: "",
      comment: "",
      validComment: false,
      postId: "",
    };
  },
  methods: {
    // checks if empty and enables comment btn
    checkValidComm() {
      if (this.comment.length > 0) {
        this.validComment = true;
      } else {
        this.validComment = false;
      }
    },
    // sends comment to the API to be saved in the db
    handleCommentSumit() {
      axios
        .post(
          `http://localhost:3000/api/posts/${this.postId}/comments`,
          {
            comment: this.comment,
          },
          this.axiosConf
        )
        .then(() => {
          this.comment = "";
          this.$store.dispatch("getComments");
        })
        .catch((error) => {
          // error
          console.log(error);
        });
    },
  },
  created() {
    this.postId = this.$route.query.id;

    const token = localStorage.getItem("token");
    this.axiosConf = {
      headers: { Authorization: `Bearer ${token}` },
    };
  },
};
</script>

<style scoped>
h4 {
  text-align: left;
  margin: 10px;
}

.user_data {
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
}

.user_data img {
  max-width: 35px;
  object-fit: contain;
}
input {
  margin: 10px;
}

.action_btns {
  display: flex;
  justify-content: flex-end;
  max-width: 640px;
  gap: 10px;
  padding: 0 11px;
}

button {
  padding: 10px;
  margin-bottom: 10px;
}

.btn-sec {
  background-color: white;
  border: 1px solid white;
}

.form_control {
  max-width: 717px;
}
</style>