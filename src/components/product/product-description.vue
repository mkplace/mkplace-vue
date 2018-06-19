<template>
    <div>
        <slot :reviews="reviews" :product_info="product_info" :product_attributes="product_attributes" :is_loading="is_loading" name="description"></slot>
        <slot :reviews="reviews" :product_info="product_info" :product_attributes="product_attributes" :is_loading="is_loading" name="attributes"></slot>
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
            product_info: {},
            product_attributes: [],
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
    methods: {
        fetchData() {
            let _this = this;

            _this.is_loading = true;

            this.$http.get(`/api/v2/product/${this.product_id}?plugin=description`, {}).then(result => {

                _this.product_info = result.body;

                _this.product_attributes = _this.product_info.productattributetypevalue_set.map(productattributetypevalue => {
                    return {
                        attribute: productattributetypevalue.categoryattribute.attribute,
                        value: productattributetypevalue.attributetypevalue
                    }
                });

                _this.is_loading = false;

            })
        }
    },
    created() {
        this.fetchData();
    }
};
</script>
