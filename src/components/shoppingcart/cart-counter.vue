<template>
    <div>
        <slot :counter="counter" :is_loading="is_loading">{{counter}}</slot>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          counter: 0,
          is_loading: true
        };
      },
      methods: {
        fetchData() {
          this.counter = Object.keys(
            this.$store.state.shared_data.shoppingcart.skus || {}
          ).length;
          this.is_loading = false;
        }
      },
      created() {
        this.fetchData();
      },
      watch: {
        "$store.state.shared_data.shoppingcart": "fetchData"
      }
    };
</script>
