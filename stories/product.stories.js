import { storiesOf, addDecorator } from "@storybook/vue";

import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { withKnobs, text, boolean, number } from "@storybook/addon-knobs/vue";

storiesOf("Products", module).add("simulation price", () => {
  return {
    data() {
      return {
        product_id: number("product_id", 13895),
        sku_id: number("sku_id", 45100)
      };
    },
    template: `<co-simulation :sku_id="sku_id">
                    <template slot-scope="{offer, has_discount, is_loading}">
                        <strong class="ais-highlight" v-if="offer && !is_loading">
                            <em class="muted" v-if="has_discount"><s>{{offer.list_price | currency}}</s></em>
                            <em class="red">{{offer.price | currency}}</em>
                        </strong>
                        <strong class="ais-highlight" v-if="!offer && !is_loading">
                            <em class="black">indisponível</em>
                        </strong>
                        <strong class="ais-highlight" v-if="is_loading">
                            <em class="muted">carregando...</em>
                        </strong>
                    </template>
                </co-simulation>`,
    methods: {
      log: e => {
        e.preventDefault();
        action("log2")(e.target);
      }
    },
    create() {
      action("log2")(e.target);
    }
  };
});


storiesOf("Products", module)
.add("full page example", () => ({
  template: `<co-product-view tag="div" :product_id="13895" :sku_id="45100" class="row">
                  <template slot-scope="{ product_id, sku_id }">

                      <div class="col-12">
                          {{product_id}}-{{sku_id}}
                      </div>

                      <div class="col-12">
                          <div class="row">
                              <div class="col-6">


                              </div>
                              <div class="col-6">
                                  <co-simulation :sku_id="sku_id">
                                      <template slot-scope="{offer, has_discount, is_loading}">

                                          <strong class="ais-highlight" v-if="offer && !is_loading">
                                              <button type="button" class="btn btn-primary"
                                                  v-if="offer.price > 0 && offer.stock_balance > 0"
                                                  v-on:click="send_to_cart($event, offer.id, quantity)">COMPRAR</button>

                                              <br />

                                              <em class="muted" v-if="has_discount"><s>{{offer.list_price | currency}}</s></em>
                                              <em class="red">{{offer.price | currency}}</em>
                                          </strong>

                                          <strong class="ais-highlight" v-if="!offer && !is_loading">
                                              <em class="black">indisponível</em>
                                          </strong>

                                          <strong class="ais-highlight" v-if="is_loading">
                                              <em class="muted">carregando...</em>
                                          </strong>

                                      </template>
                                  </co-simulation>
                              </div>
                          </div>
                      </div>

                      <div class="col-12">
                          <co-product-description :product_id="product_id">
                              <template slot-scope="{ product_info, product_attributes }" slot="description">
                                  <h3>Description</h3>
                                  <p>{{ product_info.description }}</p>
                              </template>
                              <template slot-scope="{ product_attributes }" slot="attributes">
                                  <h3>Attributes</h3>
                                  <hr />
                                  <table border="1" class="table table-hover table-striped">
                                      <thead>
                                          <tr>
                                              <th>Name</th>
                                              <th>Value</th>
                                          </tr>
                                      </thead>
                                      <thead>
                                          <tr v-for="product_attribute in product_attributes">
                                              <td>{{product_attribute.attribute.name}}</td>
                                              <td>{{product_attribute.value.value}}</td>
                                          </tr>
                                      </thead>
                                  </table>
                              </template>
                          </co-product-description>
                      </div>

                      <div class="col-12">
                          <div class="row">
                              <co-product-review :product_id="product_id">
                                  <template slot-scope="{ reviews }" slot="review_list">
                                      <div class="col-12">
                                          <h3>Reviews ({{reviews.length}})</h3>
                                          <div v-for="review in reviews">
                                              {{review}}
                                          </div>
                                      </div>
                                  </template>
                                  <template slot="no_reviews">
                                      <div class="col-12">
                                          <h3>Sem reviews</h3>
                                      </div>
                                  </template>
                                  <template slot="review_form">
                                      <div class="col-12">
                                          <h3>Review form</h3>
                                      </div>
                                  </template>
                              </co-product-review>
                          </div>
                      </div>

                  </template>
              </co-product-view>`
}))
