<template>
    <div>
        <slot :reviews="reviews" :is_loading="is_loading" name="review_list">

        </slot>
        <slot :reviews="reviews" :is_loading="is_loading" name="no_reviews">

        </slot>
        <slot :reviews="reviews" :is_loading="is_loading" name="review_form">

        </slot>
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
