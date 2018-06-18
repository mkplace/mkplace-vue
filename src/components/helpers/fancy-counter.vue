<template>
    <span>
        <slot :counter_show="display" :reset="reset" :counter="counter">{{ display }}</slot>
    </span>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      required: true
    },
    speed: {
      type: String,
      required: false,
      default: "normal"
    },
    format: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      final_num: 0,
      counter: 0,
      display: "",
      num: 0,
      finished: true,
      speeds: {
        veryslow: 500,
        slow: 400,
        normal: 300,
        regular: 200,
        fast: 100,
        flash: 50,
        superflash: 20
      }
    };
  },
  created() {
    this.display_format =
      typeof this.format == "function" ? this.format : this.formater;
    this.init(this.number || 0);
  },
  methods: {
    init(number) {
      number = parseFloat(number);
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.op = "asc";

      if (number < this.counter || number == 0) {
        this.op = "desc";
      }

      this.num = number;
      this.final_num = this.num;
      this.finished = false;
      this.speedms = this.speeds[this.speed || "normal"];
      this.start();
    },

    formater(count, finished) {
      return count;
    },

    reset() {
      this.final_num = 0;
      this.counter = 0;
      this.display = "";
      this.finished = false;
      this.start();
    },

    start() {
      this.percent = (this.num + "").length;

      this.timer = setInterval(this.loop.bind(this), this.percent * 5);

      return new Promise((resolve, reject) => {
        var tr = setInterval(
          function() {
            if (this.finished) {
              resolve();
            }
          }.bind(this, resolve),
          2
        );
      });
    },

    loop() {
      if (this.counter != this.num) {
        var p_percent = (this.num / this.speedms) * this.percent;

        var c_percent = (this.num / this.speedms) * this.percent;

        if (this.op == "asc") {
          var new_count =
            this.counter + c_percent > this.num
              ? this.num
              : this.counter + c_percent;
        } else {
          var new_count =
            this.counter - c_percent < this.num
              ? this.num
              : this.counter - c_percent;
        }

        this.counter = this.counter == 0 ? p_percent : new_count;

        this.finished = this.counter == this.num;

        this.display = this.display_format(this.counter, this.finished);

        return false;
      } else {
        clearInterval(this.timer);
      }
    }
  },
  watch: {
    number: "init"
  }
};
</script>
