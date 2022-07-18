<template>
  <div class="modal">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <h4><i class="fa-solid fa-circle-info"></i></h4>
        <span
          @click="$emit('errorChange', 'dismiss')"
          class="close"
          aria-label="Close"
          >&times;</span
        >
      </div>

      <slot></slot>
      <p>{{ msgError }}</p>
    </div>
  </div>
</template>
<script>
  // import le css pour le modal
  import "@/assets/modal.css"
  export default {
    name: "ModalBody",
    props: ['msgError']
  }
</script>