import { storiesOf, addDecorator } from "@storybook/vue";

import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { withKnobs, text, boolean, number } from "@storybook/addon-knobs/vue";

storiesOf("Addon Actions", module).add("Action and method", () => {
  return {
    data() {
      return {
        num: number("num", 10)
      };
    },
    template: `<co-fancy-counter :number="num">
                        <template slot-scope="{ counter_show, reset }">
                            <h1 v-on:click="log">currency style: {{counter_show | currency}}</h1>
                        </template>
                    </co-fancy-counter>`,
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

console.log(this);
console.log(module);

storiesOf("TESTE", module)
  .addDecorator(withKnobs)
  .add("componentName", () => {
    console.log(this, "THISSSS");
    return {
      data() {
        return {
          teste: text("dad", "dsadsa", "dsdsa")
        };
      },
      template: `<co-fancy-counter :number="100"></co-fancy-counter>`
    };
  });
