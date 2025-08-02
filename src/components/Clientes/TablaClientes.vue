<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Clientes</h3>
      <!-- Si quieres botón para agregar aquí, puedes agregarlo -->
    </div>

    <!-- Filtros -->
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

    <!-- Tabla -->
    <b-table :items="paginatedClientes" :fields="fields" responsive striped hover small class="mb-3">
      <template #cell(acciones)="row">
        <b-button size="sm" variant="info" class="me-1" @click="verCliente(row.item)">Ver</b-button>
        <b-button size="sm" variant="warning" class="me-1" @click="editarCliente(row.item)">Editar</b-button>
        <b-button size="sm" variant="danger" @click="eliminarCliente(row.item)">Eliminar</b-button>
      </template>
    </b-table>

    <!-- Paginación -->
    <b-pagination v-model="paginaActual" :total-rows="clientesFiltrados.length" :per-page="porPagina" align="center" />
  </div>
</template>

<script>
export default {
  name: 'ClientesPage',
  data() {
    return {
      search: '',
      filterRazon: '',
      filterRut: '',
      filterCentro: '',
      paginaActual: 1,
      porPagina: 15,
      clientes: [
        {
          id: 1,
          razonSocial: 'Vidaintegra',
          rut: '96.617.350-5',
          email: 'cjaques@vidaintegra.cl',
          fono: '996560489',
          contacto: 'Cristobal Jaques',
          centroMedico: 'Alameda',
        },
        {
          id: 2,
          razonSocial: 'Vidaintegra',
          rut: '96.617.350-5',
          email: 'iprecarchile@vidaintegra.cl',
          fono: '923456791',
          contacto: 'Ana Maria Ossandon',
          centroMedico: 'Puente Alto',
        },
        // Agrega más registros según necesidad
      ],
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
    }
  },
  props: {
    nuevosClientes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    clientesTotales() {
      return [...this.clientes, ...this.nuevosClientes]
    },
    clientesFiltrados() {
      return this.clientesTotales.filter((e) => {
        const texto = `${e.id} ${e.razonSocial} ${e.rut} ${e.contacto} ${e.centroMedico}`.toLowerCase()
        return (
          texto.includes(this.search.toLowerCase()) &&
          (this.filterRazon ? e.razonSocial === this.filterRazon : true) &&
          (this.filterRut ? e.rut === this.filterRut : true) &&
          (this.filterCentro ? e.centroMedico === this.filterCentro : true)
        )
      })
    },
    paginatedClientes() {
      const start = (this.paginaActual - 1) * this.porPagina
      return this.clientesFiltrados.slice(start, start + this.porPagina)
    },
    razonSocial() {
      return [...new Set(this.clientes.map((e) => e.razonSocial))].sort()
    },
    rut() {
      return [...new Set(this.clientes.map((e) => e.rut))].sort()
    },
    centroMedico() {
      return [...new Set(this.clientes.map((e) => e.centroMedico))].sort()
    },
  },
  methods: {
    verCliente(cliente) {
      alert(`Viendo cliente ID ${cliente.id}`)
    },
    editarCliente(cliente) {
      alert(`Editando cliente ID ${cliente.id}`)
    },
    eliminarCliente(cliente) {
      if (confirm(`¿Eliminar cliente ID ${cliente.id}?`)) {
        this.clientes = this.clientes.filter((e) => e.id !== cliente.id)
      }
    },
  },
}
</script>
