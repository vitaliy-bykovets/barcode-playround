<template>
    <main class="container">
        <button type="button" v-on:click="openCamera">Scan code</button>
    </main>
</template>

<script>
  export default {
    name: 'Home',
    data: function() {
      return {
        query: '',
      }
    },
    methods: {
      openCamera() {
        console.log('********* - 17', 'opened')
      },
    },
    components: {

    }
  };
</script>