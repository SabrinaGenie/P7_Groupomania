<template>
  <div>
    <hr />
    <button class="home-btn" @click="goBackHome">ACCUEIL</button>
  </div>
</template>

<script>
  export default {
    name: "HomeBtnFoot",
    methods: {
      goBackHome() {
        this.$store.commit("setSinglePostId", "")
        this.$router.push('/')
      },
    }
  }
</script>

<style scoped>
.home-btn {
  height: 40px;
  width: 100%;
  left: 0;
  bottom: 1em;
  max-width: 395px;
}

hr {
  margin: 2em auto 1em auto;
  display: block;
  max-width: 395px;
  color: var(--tertiaire);
}
</style>