<template>
    <div class="password_recovery_wrap">

        <form v-on:submit.prevent="customer_recovery" v-if="!loading && !requested && !validated && !completed">
            <slot name="form-request" :recovery="customer_recovery_req">
                <h3 class="margin-bottom-1x">Recupere seu login</h3>

                <p>Se você não está conseguindo acessar sua conta, digite seu email de cadastro e iremos enviar uma confirmação para você cadastrar sua nova senha.</p>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Entre com seu email" v-model="customer_recovery_req.email">
                </div>

                <div class="form-group">
                    <button type="submit" class="m-0 btn btn-block btn-outline-primary">Recuperar</button>
                </div>
            </slot>
        </form>

        <form v-on:submit.prevent="recovery_validation" v-if="!loading && requested && !validated">
            <slot name="form-validation" :recovery="customer_recovery_req">
                <h3 class="margin-bottom-1x">Verifique seu email</h3>

                <p>Você receberá em instantes um email na sua caixa de entrada <strong>{{ customer_recovery_req.email }}</strong> um código de validação para essa ação, digite-o no campo abaixo ou clique diretamente no link que enviamos a você.</p>

                <div class="form-group">
                    <label for="in-1">Insira o código de validação</label>
                    <div class="row code-input-wrap">
                        <div class="col-2 col-sm-1 code-input">
                            <input class="form-control" id="in-1" type="text" maxlength="1" placeholder="#" v-model="customer_recovery_req.validation.in_1" next_in="in-2" v-on:keyup="go_next" autofocus>
                        </div>
                        <div class="col-2 col-sm-1 code-input">
                            <input class="form-control" id="in-2" type="text" maxlength="1" placeholder="#" v-model="customer_recovery_req.validation.in_2" next_in="in-3" v-on:keyup="go_next">
                        </div>
                        <div class="col-2 col-sm-1 code-input">
                            <input class="form-control" id="in-3" type="text" maxlength="1" placeholder="#" v-model="customer_recovery_req.validation.in_3" next_in="in-4" v-on:keyup="go_next">
                        </div>
                        <div class="hidden-xs-down code-input-separator">
                            -
                        </div>
                        <div class="col-2 col-sm-1 code-input">
                            <input class="form-control" id="in-4" type="text" maxlength="1" placeholder="#" v-model="customer_recovery_req.validation.in_4" next_in="in-5" v-on:keyup="go_next">
                        </div>
                        <div class="col-2 col-sm-1 code-input">
                            <input class="form-control" id="in-5" type="text" maxlength="1" placeholder="#" v-model="customer_recovery_req.validation.in_5" next_in="in-6" v-on:keyup="go_next">
                        </div>
                        <div class="col-2 col-sm-1 code-input">
                            <input class="form-control" id="in-6" type="text" maxlength="1" placeholder="#" v-model="customer_recovery_req.validation.in_6">
                        </div>
                    </div>
                    <small class="text-muted">se você não receber o email em até 5 minutos, tente fazer o processo novamente ou entre em contato</small>
                </div>

                <div class="form-group m-0">
                    <button type="submit" :disabled="!code_completed" class="m-0 btn btn-block btn-outline-primary">Validar código</button>
                </div>
            </slot>
        </form>

        <form v-on:submit.prevent="password_update" v-if="!loading && requested && validated">
            <slot name="form-password-update" :recovery="customer_recovery_req">
                <h3 class="margin-bottom-1x">Digite sua nova senha</h3>

                <p><strong>Pronto!</strong> já confirmamos sua identidade, agora atualize sua senha. </p>

                <div class="form-group">
                    <label for="reg-ln">Nova senha</label>
                    <input type="password" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Entre com seu email" v-model="customer_recovery_req.password">
                </div>

                <div class="form-group">
                    <label for="reg-ln">Confirme sua nova senha</label>
                    <input type="password" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Entre com seu email" v-model="customer_recovery_req.confirm_password">
                </div>

                <div class="form-group m-0">
                    <button type="submit" class="m-0 btn btn-block btn-outline-primary">Atualizar minha senha</button>
                </div>
            </slot>
        </form>

        <div v-if="!loading && completed">
            <slot name="form-password-update" :recovery="customer_recovery_req">
                <h3 class="margin-bottom-1x">Pronto! ;)</h3>
                <h5 class="margin-bottom-1x">Sua senha foi atualiza com sucesso</h5>
                <p>Por favor, tente logar novamente com sua nova senha.</p>
            </slot>
        </div>

        <div v-if="loading">
            <slot name="recovery-loading" :recovery="customer_recovery_req">
                <strong>CARREGANDO...</strong>
            </slot>
        </div>

        <!--<div v-for="error in customer.auth.errors" class="alert alert-primary alert-dismissible fade show text-center margin-bottom-1x">
            <span class="alert-close" data-dismiss="alert"></span>
            <i class="icon-ban"></i>&nbsp;&nbsp; {{error}}
        </div> -->
    </div>
</template>

<script>export default {
      props: ["config"],
      data() {
          return {
            customer_recovery_req: {
            step: "validation",
              hash_customer: "",
              validation: {
                in_1: "",
                in_2: "",
                in_3: "",
                in_4: "",
                in_5: "",
                in_6: ""
              }
            },
      redir: {
              timer: null,
              seconds: 5
            },
            loading: false,
            requested: false,
            validated: false,
            completed: false,
            notification_handler: null,
            code_completed: false
          };
      },
      created() {
          this.init();
      },
      methods: {
          init() {
            Object.assign(this.$data, this.$options.data.call(this));
            this.notification_handler = this.config
              ? this.config.notification_handle || this.ui.notify
              : this.ui.notify;
          },
          go_next(event) {
            if (event.which != 8 && !isNaN(String.fromCharCode(event.which))) {
              let n_input = document.getElementById(
                event.target.getAttribute("next_in")
              );
              if (n_input) {
                n_input.focus();
              }
            }
          },
    customer_recovery() {
            if (!this.customer_recovery_req.email) {
              this.notification_handler("error", "Preencha seu email");
              return false;
            }

            this.loading = true;

            let req = this.$http
              .post("/api/backend/customer/retrieve_token_recovery", {
                email: this.customer_recovery_req.email
              })
              .then(
                function(resp) {
                  this.loading = false;

                  if (!resp.body.error) {
                    this.requested = true;
                  }

                  if (resp.body.error == "client_not_found") {
                    this.notification_handler(
                      "error",
                      "Desculpe, não encontramos nenhum cadastro com o email informado, tente realizar um novo cadastro se necessário."
                    );
                    return false;
                  }
                }.bind(this)
              );
          },
    timer_count() {
            this.redir.seconds -= 1;
            if (this.redir.seconds == 0) {
              clearInterval(this.redir.timer);
            }
          },
          recovery_validation() {
            this.loading = true;

            let req = this.$http
              .post(
                "/api/backend/customer/recovery_password",
                this.customer_recovery_req
              )
              .then(
                function(resp) {
                  this.loading = false;

                  if (!resp.body.error) {
                    this.validated = true;
                    this.customer_recovery_req.step = "";
                  }

                  if (resp.body.error == "invalid_hash") {
                    this.notification_handler(
                      "error",
                      "Código de validação está incorreto!"
                    );
                    return false;
                  }
                }.bind(this)
              );
          },
    password_update() {
      if (
              this.customer_recovery_req.password !=
              this.customer_recovery_req.confirm_password
            ) {
              this.notification_handler(
                "error",
                "A senha e a confirmação de senha não são iguais"
              );
              return false;
            }

            this.loading = true;

            let req = this.$http
              .post(
                "/api/backend/customer/recovery_password",
                this.customer_recovery_req
              )
              .then(
                function(resp) {
                  this.loading = false;

                  if (!resp.body.error) {
                    this.init();
                    this.completed = true;
                    this.redir.timer = setInterval(this.timer_count, 1000);
                    this.notification_handler(
                      "success",
                      "Senha atualizada com sucesso, você será redirecionado em 5s!"
                    );
                  }

                  if (resp.body.error == "invalid_hash") {
                    this.notification_handler(
                      "error",
                      "Código de validação está incorreto!"
                    );
                    return false;
                  }

                  if (resp.body.error == "password_match") {
                    this.notification_handler(
                      "error",
                      "A senha e a confirmação de senha não são iguais"
                    );
                    return false;
                  }
                }.bind(this)
              );
          }
      },
  watch: {
          "customer_recovery_req.validation": {
            handler: function(validation, ok) {
              var ns = "";
              Object.keys(validation).forEach(i_n => {
                ns += validation[i_n];
              });
              this.customer_recovery_req.hash_customer = ns;
            },
            deep: true
          },
        "customer_recovery_req.hash_customer": function(hash_customer) {
            this.code_completed = hash_customer.length == 6;
            return this.code_completed;
          }
  }
};
</script>
