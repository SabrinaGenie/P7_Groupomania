<template>
  <button>{{ btnTitle }}</button>
</template>

<script>
    export default{
        name: "BtnComp",
        props: ["btnTitle"]
    }
</script>


<style scoped>
button{
    background-color: blue;
    color: white; 
    padding: 0.5em;
}
</style>