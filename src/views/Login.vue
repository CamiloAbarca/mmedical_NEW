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

              <b-button
                variant="primary"
                type="submit"
                :disabled="cargando"
                class="w-100"
                style="background-color: #4ecdc4; border-color: #4ecdc4; color: #ffffff;"
              >
                <b-spinner
                  small
                  v-if="cargando"
                  class="mr-2"
                />
                Iniciar sesión
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
      cargando: false
    };
  },
  methods: {
    async login() {
      this.cargando = true;
      try {
        // Tu lógica de autenticación aquí
        await this.autenticarUsuario();
        // Redirecciona o muestra mensaje de éxito
      } catch (error) {
        // Maneja el error
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>
