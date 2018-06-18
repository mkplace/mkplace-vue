<template>
    <div>
        <slot :reviews="reviews" :is_loading="is_loading" name="description"></slot>
        <slot :reviews="reviews" :is_loading="is_loading" name="attributes"></slot>
    </div>
</template>

<script>
    export default {
      props: {
        product_id: {
          type: Number,
          required: true
        },
        sku_id: {
          type: Number,
          required: false
        }
      },
      data() {
        return {
          is_loading: false,
          reviews: [
            {
              cor: "azul",
              tamanho: "preto"
            },
            {
              cor: "vermelho",
              tamanho: "preto"
            }
          ]
        };
      },
      created() {}
    };
</script>
