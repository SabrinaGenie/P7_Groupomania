<template>
  <div class="home">
    <div v-if="$store.state.user === null">
      <h2>Vous n'êtes pas connecté(e)</h2>
    </div>
    <div v-else>
      <div class="greeting">
        <p>Bonjour {{ $store.state.user.firstName }} &#128522;</p>
      </div>
      <h2>PUBLICATIONS</h2>
      <card-comp
        @click="selectPost(post.id)"
        class="card-post"
        v-for="post in $store.state.posts"
        :key="post.description"
      >
        <h2>{{ post.message }}</h2>
        <p>Écrit par {{ post.User.username }}</p>
      </card-comp>
    </div>
  </div>
</template>

<script>
import CardComp from "@/components/CardComp.vue";
export default {
  name: "HomeView",
  components: {
    CardComp,
  },
  created() {
    this.$store.dispatch("getPosts");
  },
  methods: {
    selectPost(val) {
      // console.log(val)
      this.$router.push(`/singlepost?id=${val}`);
    },
  },
};
</script>

<style scoped>
.card-post {
  cursor: pointer;
}
.card-post:hover {
  box-shadow: 0 -1px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%),
    0 1px 5px 0 rgb(0 0 0 / 20%);
  background-color: rgba(206, 203, 203, 0.2);
}

.card-post:hover > .right-line {
  transform: scaleX(1);
}

.greeting {
  text-align: right;
  padding-right: 15px;
}
</style>
