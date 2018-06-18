<script>
    export default {
      data() {
        return {
          has_item: false,
          items: []
        };
      },
      methods: {
        fetchData() {
          if (this.$store.state.shared_data.shoppingcart) {
            this.has_item =
              Object.keys(this.$store.state.shared_data.shoppingcart.skus || {})
                .length != 0;
            this.items = this.$store.state.shared_data.shoppingcart.skus;
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
