import Vuex from "vuex";
import moment from "moment";
import jscookie from "js-cookie";
import VueCookie from "vue-cookie";
import VueResource from "vue-resource";

// Shoppingcart components
import Cart from "./components/shoppingcart/cart.vue";
import EmptyCart from "./components/shoppingcart/empty-cart.vue";
import CartItemResult from "./components/shoppingcart/cart-item-result.vue";
import HasCartItem from "./components/shoppingcart/has-cart-item.vue";
import CartCounter from "./components/shoppingcart/cart-counter.vue";
import CartSummary from "./components/shoppingcart/cart-summary.vue";

// Product and Sku components
import Simulation from "./components/product/simulation.vue";
import ProductView from "./components/product/product-view.vue";
import ProductReview from "./components/product/product-review.vue";
import ProductDescription from "./components/product/product-description.vue";

import FancyCounter from "./components/helpers/fancy-counter.vue";

// Customer and myaccount components
import Recovery from "./components/customer/recovery.vue";
import Login from "./components/customer/login.vue";
import CustomerInfo from "./components/customer/info.vue";

import HelloWorld from "./components/HelloWorld";

const MkplaceVue = {
  HelloWorld,
  Cart,
  EmptyCart,
  CartItemResult,
  HasCartItem,
  CartCounter,
  CartSummary,
  Simulation,
  ProductView,
  ProductReview,
  ProductDescription,
  FancyCounter,
  Recovery,
  Login,
  CustomerInfo,

  install(Vue, options) {
    Vue.use(Vuex);
    Vue.use(VueCookie);
    Vue.use(VueResource);

    const LOGIN = "LOGIN";
    const LOGIN_SUCCESS = "LOGIN_SUCCESS";
    const LOGOUT = "LOGOUT";
    const UPDATE_CART = "UPDATE_CART";
    const HANDLE_CUSTOMER = "HANDLE_CUSTOMER";

    const storeMkplace = new Vuex.Store({
      state: {
        isLoggedIn: jscookie.get("loggedin") || false,
        refresh_cart: false,
        customer: {},

        // mkplace storeMkplace
        shared_data: {
          customer: {},
          simulation: [],
          shoppingcart: {},
          shoppingcart_firstload: false
        }
      },
      mutations: {
        [LOGIN](state) {
          state.pending = true;
        },
        [LOGIN_SUCCESS](state) {
          state.isLoggedIn = true;
          state.pending = false;
          jscookie.set("loggedin", 1);
        },
        [LOGOUT](state) {
          state.isLoggedIn = false;
          state.pending = false;
          jscookie.remove("loggedin");
          state.customer = {};
        },
        [UPDATE_CART](state) {
          state.refresh_cart = true;
        },
        [HANDLE_CUSTOMER](state, customer) {
          state.customer = customer;
        },
        add_sku_to_simulation(state, simulation) {
          state.shared_data.simulation.push(simulation);
        }
      },
      actions: {
        login({ state, commit, rootState }) {
          commit(LOGIN);
        },

        login_success({ state, commit, rootState }) {
          commit(LOGIN_SUCCESS);
        },

        logout({ state, commit, rootState }) {
          commit(LOGOUT);
        },

        refresh_cart({ state, commit, rootState }) {
          commit(UPDATE_CART);
        }
      },
      getters: {
        isLoggedIn: state => {
          return state.isLoggedIn;
        },
        getCustomer: state => {
          return state.customer;
        }
      }
    });

    var prefix = "Co";
    Vue.component("hello-world", HelloWorld);
    Vue.component(prefix + "Recovery", Recovery);
    Vue.component(prefix + "FancyCounter", FancyCounter);
    Vue.component(prefix + "Cart", Cart);
    Vue.component(prefix + "CartCounter", CartCounter);
    Vue.component(prefix + "EmptyCart", EmptyCart);
    Vue.component(prefix + "HasCartItem", HasCartItem);
    Vue.component(prefix + "ProductReview", ProductReview);
    Vue.component(prefix + "ProductDescription", ProductDescription);
    Vue.component(prefix + "CartItemResult", CartItemResult);
    Vue.component(prefix + "CartSummary", CartSummary);
    Vue.component(prefix + "Simulation", Simulation);
    Vue.component(prefix + "Login", Login);
    Vue.component(prefix + "ProductView", ProductView);
    Vue.component(prefix + "CustomerInfo", CustomerInfo);

    let MkplaceMixin = {
      strSplit(v, w = ",", index = 0) {
        return v.split(w)[index];
      },
      toCurrency(v, currency = "BRL") {
        if (!v) v = 0;
        v = Math.round(parseFloat(v) * 1e2) / 1e2;
        if (typeof v !== "number") throw new Error("invalid number!");
        return v.toLocaleString("pt-BR", {
          style: "currency",
          currency: currency
        });
      },
      toDecimal(v) {
        if (!v) v = 0;
        v = Math.round(parseFloat(v) * 1e2) / 1e2;
        if (typeof v !== "number") throw new Error("invalid number!");
        return v
          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
          .replace("R$", "");
      },
      // imported from old mkplace catalog. workaround purposes
      GetCardType: function(number) {
        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null) return "VISA";

        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (
          /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
            number
          )
        )
          return "MASTERCARD";

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) != null) return "AMEX";

        // Discover
        re = new RegExp(
          "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
        );
        if (number.match(re) != null) return "DISCOVER";

        // Diners
        re = new RegExp("^36");
        if (number.match(re) != null) return "DINERS";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) != null) return "DINERS";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) != null) return "JCB";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) != null) return "VISA";

        return "";
      },
      formatDate(v, format) {
        if (v !== "None" && v) {
          let m = moment(v);
          if (m.isValid()) return m.format(format);
        }
        return "";
      },

      translatedOrderStatus(v) {
        let translate_order_status = {
          CREATED: "Criado",
          APPROVED: "Aprovado",
          "PARTLY-APPROVED": "Parcialmente Aprovado",
          CANCELED: "Cancelado",
          "PARTLY-CANCELED": "Parcialmente Cancelado",
          BILLED: "Faturado",
          "PARTLY-BILLED": "Parcialmente Faturado",
          SENT: "Enviado",
          "PARTLY-SENT": "Parcialmente Enviado",
          DELIVERED: "Entregue",
          "PARTLY-DELIVERED": "Parcialmente Entregue",
          "WAITING-BILL-INPUT": "Em análise de dados de pagamento",
          "WAITING-PAYMENT": "Aguardando pagamento",
          "WAITING-CHECKING": "Em análise"
        };

        return translate_order_status[v];
      }
    };

    Vue.mixin({
      data() {
        return {
          storeMkplace,
          customer: {
            auth: {
              errors: []
            }
          }
        };
      },
      computed: {
        ui() {
          return {
            notify(type, message) {
              console.log(type, message);
            }
          };
        }
      },
      updated() {
        // this.cart_load();
      },
      created() {
        // this.cart_load();
      },
      methods: {
        // customer mixins
        get_customer(cb) {
          var self = this;
          if (
            Object.keys(self.storeMkplace.state.shared_data.customer).length ==
            0
          ) {
            self.$http
              .get("/api/backend/customer/loggedin")
              .then(function(response) {
                self.storeMkplace.state.shared_data.customer = response.body;
                return cb(true, self.storeMkplace.state.shared_data.customer);
              })
              .catch(function(response) {
                return cb(false, {});
              });
            return false;
          }
          cb(true, self.storeMkplace.state.shared_data.customer);
        },
        customer_login() {
          this.customer.auth.errors = [];
          return new Promise(
            ((resolve, reject) => {
              this.$http
                .post("/api/backend/customer/auth", this.customer.auth)
                .then(function(response) {
                  var next_url = this.$route.query.next || "/";
                  this.$cookie.set("loggedin", true);

                  this.get_customer((is_logged, customer) => {
                    if (is_logged) {
                      this.$router.push({ path: next_url });
                      resolve(true);
                    } else {
                      reject(false);
                    }
                  });
                })
                .catch(function(err) {
                  resolve(false);
                  this.customer.auth.errors.push(
                    "Digite corretamente seu email ou senha"
                  );
                });
            }).bind(this)
          );
        },
        customer_logout() {
          return this.$http.get("/api/backend/customer/logout").then(
            function() {
              this.storeMkplace.state.shared_data.customer = {};
              this.$cookie.delete("loggedin");
              if (this.$route.meta.requiresAuth) {
                this.$router.push({
                  path: "/user/signin?next=" + this.$route.fullPath
                });
              }
            }.bind(this)
          );
        },

        // shoppingcart mixins
        cart_load(reload) {
          var self = this;
          return new Promise((resolve, reject) => {
            if (
              !self.storeMkplace.state.shared_data.shoppingcart_firstload ||
              reload == true
            ) {
              self.storeMkplace.state.shared_data.shoppingcart_firstload = true;
              self.$http
                .post("/api/backend/simulation_price")
                .then(function(response) {
                  self.storeMkplace.state.shared_data.shoppingcart =
                    response.body;
                  resolve();
                });
              return false;
            }
            resolve();
          });
        },
        send_to_cart(evt, offer_id, quantity = 1) {
          let self = this;
          this.$http
            .post("/api/backend/cart", {
              seller_offer: offer_id,
              quantity: quantity.toString()
            })
            .then(function() {
              // self.cart_load(true);
              window.location.href = "/store/cart";
              return false;
            });
        },
        cart_update(item, quantity) {
          item.quantity = quantity || item.quantity;

          item.loading = true;

          let self = this;

          this.$http
            .post("/api/backend/cart", {
              seller_offer: item.offers[item.selected_offer_index].id,
              quantity: item.quantity.toString() || "0"
            })
            .then(function() {
              item.loading = false;
              self.cart_load(true);
            });
        }
      }
    });

    Vue.filter("currency", MkplaceMixin.toCurrency);
    Vue.filter("formatDate", MkplaceMixin.formatDate);
    Vue.filter("translateOrderStatus", MkplaceMixin.translatedOrderStatus);
  }
};

// Export library
export default MkplaceVue;

// Export components
export {
  HelloWorld,
  Cart,
  EmptyCart,
  CartItemResult,
  HasCartItem,
  CartCounter,
  CartSummary,
  Simulation,
  ProductView,
  ProductReview,
  ProductDescription,
  FancyCounter,
  Recovery,
  Login,
  CustomerInfo
};
