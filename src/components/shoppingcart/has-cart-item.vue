<template>
    <div>
        <slot :has_item="has_item" v-if="has_item"></slot>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          has_item: false
        };
      },
      watch: {
        "$store.state.shared_data.shoppingcart"() {
          this.has_item =
            Object.keys(this.$store.state.shared_data.shoppingcart.skus || {})
              .length != 0;
        }
      }
    };
</script>
