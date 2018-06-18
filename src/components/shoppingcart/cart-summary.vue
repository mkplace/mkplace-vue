<template>
    <div>
        <slot :is_loading="is_loading" :summary="summary"></slot>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          is_loading: false,
          summary: {}
        };
      },
      methods: {
        fetchData() {
          if (this.$store.state.shared_data.shoppingcart) {
            this.is_loading = false;
            this.summary = this.$store.state.shared_data.shoppingcart.summary;
          }
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
