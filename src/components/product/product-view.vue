<template>
    <div>
        <slot :skus="skus" :product_id="product_id" :sku_id="sku_id" :is_loading="is_loading"></slot>
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
          skus: {
            123: {
              cor: "azul",
              tamanho: "preto"
            },
            321: {
              cor: "vermelho",
              tamanho: "preto"
            }
          }
        };
      },
      created() {}
    };
</script>
