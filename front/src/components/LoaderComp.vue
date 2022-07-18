<template>
  <div class="gooey">
    <span class="dot"></span>
    <div class="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped>
.gooey {
    position: fixed;
    top: 5%;
    left: 18%;
    width: 102%;
    height: 95%;
    margin: -20px 0 0 -71px;
    background: linear-gradient(to top, #fff 0%, #ffffffb3 80%);
}
.gooey .dot {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 318px;
  left: 32%;
  filter: blur(2px);
  background: grey;
  border-radius: 50%;
  transform: translateX(0);
  animation: dot 2.8s infinite;
}
.gooey .dots {
  transform: translateX(0);
  margin-top: 318px;
  margin-left: 36%;
  animation: dots 2.8s infinite;
}
.gooey .dots span {
  display: block;
  float: left;
  width: 16px;
  height: 16px;
  margin-left: 16px;
  filter: blur(2px);
  background: #4e5166;
  border-radius: 50%;
}
@-moz-keyframes dot {
  50% {
    transform: translateX(96px);
  }
}
@-webkit-keyframes dot {
  50% {
    transform: translateX(96px);
  }
}
@-o-keyframes dot {
  50% {
    transform: translateX(96px);
  }
}
@keyframes dot {
  50% {
    transform: translateX(96px);
  }
}
@-moz-keyframes dots {
  50% {
    transform: translateX(-31px);
  }
}
@-webkit-keyframes dots {
  50% {
    transform: translateX(-31px);
  }
}
@-o-keyframes dots {
  50% {
    transform: translateX(-31px);
  }
}
@keyframes dots {
  50% {
    transform: translateX(-31px);
  }
}

@media (min-width: 768px) { 
    .gooey .dot {
        left: 34%;
    }
 }

</style>