<template>
  <div class="card">
    <slot>dynamic content here</slot>
    <div class="right-line"></div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  max-width: 745px;
  padding: 0.8em 0.5rem;
  margin: 10px;
}
.right-line {
  background-color: var(--primaire);
  border-right: var(--primaire);
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  width: 1%;
  border-radius: 0px 2px 2px 0;
}
</style>