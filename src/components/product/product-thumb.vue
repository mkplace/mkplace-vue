<div class="product-thumb">
    <img :src="result.sku_image" alt="" width="100%">
    <div class="caption text-left">
        <div class="manufacturer">
            <strong class="ais-highlight">
                <em class="black">{{result.manufacturer.name}}</em>
            </strong>
        </div>
        <div class="title">
            <ais-highlight tag="strong" :result="result" attribute-name="sku_name"></ais-highlight>
        </div>
        <div class="pricing">
            <simulation :sku_id="result.sku.id">
                <template slot-scope="{offer, is_loading}">
                    <strong class="ais-highlight" v-if="offer != null && !is_loading">
                        <em class="muted"><s>{{offer.list_price | currency}}</s></em> - <em class="red">{{offer.price | currency}}</em>
                    </strong>
                    <strong class="ais-highlight" v-if="offer == null && !is_loading">
                        <em class="black">indisponível</em>
                    </strong>
                    <strong class="ais-highlight" v-if="is_loading == true">
                        <em class="muted">carregando...</em>
                    </strong>
                </template>
            </simulation>
        </div>
    </div>
</div>
