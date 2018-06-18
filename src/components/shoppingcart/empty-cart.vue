<template>
    <div>
        <slot :is_empty="is_empty" v-if="is_empty"></slot>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          is_empty: false
        };
      },
      watch: {
        "$store.state.shared_data.shoppingcart"() {
          this.is_empty =
            Object.keys(this.$store.state.shared_data.shoppingcart.skus || {})
              .length == 0;
        }
      }
    };
</script>
