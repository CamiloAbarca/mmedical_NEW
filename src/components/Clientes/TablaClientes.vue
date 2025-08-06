<template>
  <div>
    <h3 class="text-primary mb-3">Clientes</h3>

    <b-row class="mb-3">
      <b-col md="3">
        <b-form-input v-model="search" placeholder="Buscar por Razón Social, RUT, Contacto, Centro Médico"
          class="mb-2" />
      </b-col>
      <b-col md="3">
        <b-form-select v-model="filterRazon" :options="razonSocial" class="mb-2">
          <template #first>
            <option value="">Filtrar por Razón Social</option>
          </template>
        </b-form-select>
      </b-col>
      <b-col md="3">
        <b-form-select v-model="filterRut" :options="rut" class="mb-2">
          <template #first>
            <option value="">Filtrar por RUT</option>
          </template>
        </b-form-select>
      </b-col>
      <b-col md="3">
        <b-form-select v-model="filterCentro" :options="centroMedico" class="mb-2">
          <template #first>
            <option value="">Filtrar por Centro Médico</option>
          </template>
        </b-form-select>
      </b-col>
    </b-row>

    <b-table :items="paginatedClientes" :fields="fields" responsive striped hover small class="mb-3">
      <template #cell(acciones)="row">
        <b-button size="sm" title="Ver / Acciones" class="btn-icono"
          style="background-color: #4ecdc4; border-color: #4ecdc4;" @click="abrirModal(row.item)">
          <b-icon icon="gear" font-scale="1" />
        </b-button>
      </template>
    </b-table>

    <b-pagination v-model="paginaActual" :total-rows="clientesFiltrados.length" :per-page="porPagina" align="center"
      class="mt-3" pills variant="primary" />

    <ClienteModal v-if="clienteSeleccionado" :cliente="clienteSeleccionado" @cerrar="cerrarModal"
      @editar="editarCliente" @eliminar="eliminarCliente" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ClienteModal from './ClienteModal.vue';

export default {
  name: 'TablaClientes',
  components: {
    ClienteModal,
  },
  data() {
    return {
      clienteSeleccionado: null,
      mostrarModal: false,
      search: '',
      filterRazon: '',
      filterRut: '',
      filterCentro: '',
      paginaActual: 1,
      porPagina: 15,
      fields: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'razonSocial', label: 'Razón Social', sortable: true },
        { key: 'rut', label: 'RUT', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'fono', label: 'Fono', sortable: true },
        { key: 'contacto', label: 'Contacto', sortable: true },
        { key: 'centroMedico', label: 'Centro Médico', sortable: true },
        { key: 'acciones', label: 'Acciones' },
      ],
    };
  },
  created() {
    this.cargarClientes();
  },
  computed: {
    ...mapGetters(['obtenerClientes']),
    clientesTotales() {
      return this.obtenerClientes;
    },
    clientesFiltrados() {
      return this.clientesTotales.filter((e) => {
        const texto = `${e.id} ${e.razonSocial} ${e.rut} ${e.contacto} ${e.centroMedico}`.toLowerCase();
        return (
          texto.includes(this.search.toLowerCase()) &&
          (this.filterRazon ? e.razonSocial === this.filterRazon : true) &&
          (this.filterRut ? e.rut === this.filterRut : true) &&
          (this.filterCentro ? e.centroMedico === this.filterCentro : true)
        );
      });
    },
    paginatedClientes() {
      const start = (this.paginaActual - 1) * this.porPagina;
      return this.clientesFiltrados.slice(start, start + this.porPagina);
    },
    razonSocial() {
      return [...new Set(this.obtenerClientes.map((e) => e.razonSocial))].sort();
    },
    rut() {
      return [...new Set(this.obtenerClientes.map((e) => e.rut))].sort();
    },
    centroMedico() {
      return [...new Set(this.obtenerClientes.map((e) => e.centroMedico))].sort();
    },
  },
  methods: {
    ...mapActions(['cargarClientes', 'eliminarCliente', 'actualizarCliente']),
    abrirModal(cliente) {
      this.clienteSeleccionado = cliente;
      this.$root.$emit('bv::show::modal', 'modal-cliente');
    },
    cerrarModal() {
      this.clienteSeleccionado = null;
      this.$root.$emit('bv::hide::modal', 'modal-cliente');
    },
    async editarCliente(cliente) {
      try {
        await this.actualizarCliente(cliente);
        await this.cargarClientes();
        this.cerrarModal();
      } catch (error) {
        console.error('Error al editar cliente:', error);
      }
    },
    async eliminarCliente(id) {
      if (confirm(`¿Eliminar cliente ID ${id}?`)) {
        try {
          await this.$store.dispatch('eliminarCliente', id);
          await this.cargarClientes();
          this.cerrarModal();
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
        }
      }
    },
  },
};
</script>