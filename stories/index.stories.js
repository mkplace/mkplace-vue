import { storiesOf } from "@storybook/vue";

storiesOf("Helpers", module).add("fancy counter", () => ({
  template: `<co-fancy-counter :number="100">
                <template slot-scope="{ counter_show, reset }">
                    <h1>
                        currency style: {{counter_show | currency}}<br />
                        <small>style simple: {{counter_show}}</small>
                    </h1>
                    <button class="btn btn-danger" v-on:click.prevent="reset">reset counter</button>
                </template>
             </co-fancy-counter>`
}));

storiesOf("Customer", module)
  .add("login", () => ({
    template: `<hello-world></hello-world>`
  }))

  .add("register", () => ({
    template: `<hello-world></hello-world>`
  }))

  .add("info", () => ({
    template: `<co-customer-info inline-template>
                  <div>
                      <div v-if="!is_logged">
                          <h3>Olá visitante</h3>
                      </div>
                      <div v-if="is_logged">
                          <h3>Olá {{current_customer.entity.first_name}}</h3>
                      </div>
                      <hr class="mt-4 mb-4">
                      {{current_customer}}
                  </div>
              </co-customer-info>`
  }));
