<template>
  <div class="login-page d-flex align-items-center justify-content-center px-3 py-5">
    <b-container>
      <b-row align-h="center">
        <b-col cols="12" sm="10" md="6" lg="4">
          <div class="text-center mb-3">
            <img src="@/assets/logo.png" alt="Logo" class="img-fluid" style="max-height: 80px;" />
          </div>

          <b-card class="p-3 shadow-sm rounded">
            <div class="text-center mb-3">
              <h4 class="mb-1">Bienvenido</h4>
              <small class="text-muted">Ingresa tus credenciales</small>
            </div>

            <b-form @submit.prevent="login">
              <b-form-group label="Usuario" label-for="usuario">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-icon icon="person-fill" />
                  </b-input-group-prepend>
                  <b-form-input id="usuario" v-model="user" required placeholder="Usuario" />
                </b-input-group>
              </b-form-group>

              <b-form-group label="Contraseña" label-for="password">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-icon icon="lock-fill" />
                  </b-input-group-prepend>
                  <b-form-input id="password" type="password" v-model="password" required placeholder="********" />
                </b-input-group>
              </b-form-group>

              <b-button type="submit" block style="background-color: #4ecdc4; border-color: #4ecdc4; color: #ffffff;">
                Entrar
              </b-button>

            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      user: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.user && this.password) {
        localStorage.setItem('auth', 'true')
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  overflow: hidden;
  background-color: #ffffff;
  /* blanco limpio */
}

b-card {
  border-radius: 0.75rem;
}

@media (max-height: 600px) {
  .login-page {
    align-items: flex-start;
    padding-top: 2rem;
    height: auto;
  }
}
</style>
