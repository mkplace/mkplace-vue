<template>
    <div>
        <slot :offer="current.pricing" :has_discount="has_discount" :is_loading="current.loading">
            <div v-if="current.pricing">
                <s>{{current.pricing.list_price}}</s> - <b>{{current.pricing.price}}</b>
            </div>
        </slot>
    </div>
</template>

<script>
    export default {
      props: ["sku_id"],
      data() {
        return {
          has_discount: false
        };
      },
      created() {
        this.storeMkplace.commit("add_sku_to_simulation", {
          sku_id: this.sku_id,
          requested: false,
          loading: false,
          pricing: {}
        });
      },
  methods: {
        set_pricing(index, pricing) {
          this.storeMkplace.state.shared_data.simulation[index].pricing = pricing;
        },
        load_simulation() {
          let self = this;

          if (
            this.storeMkplace.state.shared_data.simulation.filter(
              simulation => simulation.sku_id == self.sku_id
            ).length == 0
          ) {
            this.storeMkplace.commit("add_sku_to_simulation", {
              sku_id: this.sku_id,
              requested: false,
              loading: false,
              pricing: {}
            });
            return false;
          }

          let loads = [{ skus: [] }];

          this.storeMkplace.state.shared_data.simulation
            .filter(simulation => !simulation.requested)
            .forEach(simulation => {
              simulation.loading = true;
              simulation.requested = true;
              loads[0].skus.push(simulation);
            });

          if (loads.filter(l => l.skus.length > 0).length > 0) {
            loads.forEach(load => {
              let get_price = new Promise((resolve, reject) => {
                self.$http
                  .post("/api/pricing/simulation", {
                    skus: load.skus.map(s => {
                      return { id: s.sku_id };
                    })
                  })
                  .then(function(response) {
                    resolve(response.body.result.skus);
                  });
              });
              load.skus.forEach((simulation, index) => {
                simulation.loading = true;
                simulation.promise = get_price;
                simulation.promise.then(pricing => {
                  simulation.loading = false;
                  simulation.pricing =
                    pricing[simulation.sku_id].offers[
                      pricing[simulation.sku_id].best_offer_index
                    ] || null;
                  if (!simulation.pricing.stock_balance > 0) {
                    simulation.pricing = null;
                  } else {
                    if (simulation.pricing.price != simulation.pricing.list_price) {
                      self.has_discount = true;
                    }
                  }
                  self.$forceUpdate();
                });
              });
            });
          }
        }
      },
      mounted() {
        this.load_simulation();
      },
      updated() {
        this.load_simulation();
      },
      watch: {
        sku_id: "load_simulation"
      },
      computed: {
        current: function() {
          return this.storeMkplace.state.shared_data.simulation.filter(
            simulation => simulation.sku_id == this.sku_id
          )[0];
    }
      }
    };
</script>
