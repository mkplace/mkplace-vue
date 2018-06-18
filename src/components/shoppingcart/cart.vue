<template>
    <div>
        <slot :is_loading="is_loading"></slot>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          is_loading: true
        };
      }
    };
</script>
