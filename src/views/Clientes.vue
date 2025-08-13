<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <b-button variant="primary" @click="mostrarModal = true" style="background-color: #4ecdc4; border-color: #4ecdc4">
        <b-icon icon="plus-circle" class="me-1" />
        Agregar Cliente
      </b-button>
    </div>

    <TablaClientes />

    <b-modal id="modal-agregar-cliente" v-model="mostrarModal" title="Agregar Nuevo Cliente" @hide="resetFormulario"
      hide-footer centered size="md" :header-style="{ backgroundColor: '#556270', color: 'white' }">
      <b-form @submit.prevent="guardarCliente" ref="form">
        <b-form-group label="Razón Social" label-for="razonSocial">
          <b-form-input id="razonSocial" v-model.trim="form.razonSocial" required placeholder="Ej: Vidaintegra" />
        </b-form-group>
        <b-form-group label="RUT" label-for="rut">
          <b-form-input id="rut" v-model.trim="form.rut" required placeholder="Ej: 96.617.350-5" />
        </b-form-group>
        <b-form-group label="Email" label-for="email">
          <b-form-input id="email" type="email" v-model.trim="form.email" required
            placeholder="Ej: correo@empresa.cl" />
        </b-form-group>
        <b-form-group label="Fono" label-for="fono">
          <b-form-input id="fono" v-model.trim="form.fono" required placeholder="Ej: 999999999" />
        </b-form-group>
        <b-form-group label="Contacto" label-for="contacto">
          <b-form-input id="contacto" v-model.trim="form.contacto" required placeholder="Ej: Juan Pérez" />
        </b-form-group>
        <b-form-group label="Centro Médico" label-for="centroMedico">
          <b-form-input id="centroMedico" v-model.trim="form.centroMedico" required placeholder="Ej: Alameda" />
        </b-form-group>
        <div class="text-end mt-3">
          <b-button type="submit"
            style="background-color: #c7f464; border-color: #c7f464; color: #333; margin-right: 8px;">
            Guardar
          </b-button>
          <b-button variant="danger" style="background-color: #ff6b6b; border-color: #ff6b6b" @click="cerrarModal">
            Cancelar
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import TablaClientes from '@/components/Clientes/TablaClientes.vue';
import { mapActions } from 'vuex';

export default {
  name: 'ClientesView',
  components: {
    TablaClientes,
  },
  data() {
    return {
      mostrarModal: false,
      form: {
        razonSocial: '',
        rut: '',
        email: '',
        fono: '',
        contacto: '',
        centroMedico: '',
      },
    };
  },
  methods: {
    ...mapActions(['agregarCliente', 'cargarClientes']),
    async guardarCliente() {
      if (
        !this.form.razonSocial ||
        !this.form.rut ||
        !this.form.email ||
        !this.form.fono ||
        !this.form.contacto ||
        !this.form.centroMedico
      ) {
        alert('Por favor, complete todos los campos.');
        return;
      }
      const nuevoCliente = { ...this.form };
      try {
        await this.agregarCliente(nuevoCliente);
        await this.cargarClientes();
        this.mostrarModal = false;
        this.resetFormulario();
      } catch (error) {
        console.error('Error al guardar el cliente:', error);
        alert('Hubo un error al guardar el cliente.');
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.resetFormulario();
    },
    resetFormulario() {
      this.form = {
        razonSocial: '',
        rut: '',
        email: '',
        fono: '',
        contacto: '',
        centroMedico: '',
      };
    },
  },
};
</script>