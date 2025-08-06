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

            <b-alert v-if="error" variant="danger" dismissible>
              {{ error }}
            </b-alert>

            <b-form @submit.prevent="login">
              <b-form-group label="Usuario" label-for="usuario">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-icon icon="person-fill" />
                  </b-input-group-prepend>
                  <b-form-input id="usuario" v-model="user" required placeholder="Correo electrónico" />
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
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      user: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      if (this.user && this.password) {
        try {
          const res = await axios.post('http://localhost:3000/api/usuarios/login', {
            email: this.user,
            password: this.password
          });

          const token = res.data.token;
          const user = res.data.user;

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          // ✅ Toast de bienvenida
          this.$bvToast.toast(`Bienvenido ${user.nombre}`, {
            title: 'Inicio de sesión exitoso',
            variant: 'success',
            solid: true,
            autoHideDelay: 3000
          });

          this.$router.push('/dashboard');
        } catch (err) {
          // ❌ Toast de error
          this.$bvToast.toast('Credenciales incorrectas. Intenta nuevamente.', {
            title: 'Error de inicio de sesión',
            variant: 'danger',
            solid: true,
            autoHideDelay: 3000
          });
        }
      } else {
        this.$bvToast.toast('Por favor completa ambos campos.', {
          title: 'Campos incompletos',
          variant: 'warning',
          solid: true,
          autoHideDelay: 3000
        });
      }
    }

  }
};
</script>
