<script>
    export default {
      data() {
        return {
          is_logged: false,
          current_customer: {}
        };
      },
      methods: {
        fetchData() {
          this.get_customer((is_logged, customer) => {
            this.is_logged = is_logged;
            this.current_customer = customer;
          });
        }
      },
      created() {
        this.fetchData();
      },
      watch: {
        "$store.state.shared_data.customer": "fetchData"
      }
    };
</script>
