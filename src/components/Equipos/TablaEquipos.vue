<template>
  <div>
    <h3 class="text-primary mb-3">Equipos</h3>

    <b-row class="mb-3">
      <b-col md="3">
        <b-form-input v-model="search" placeholder="Buscar por ID, Marca, Modelo, Nro de Serie" />
      </b-col>
      <b-col md="3">
        <b-form-select v-model="filterMarca" :options="marcas" class="mb-2">
          <template #first>
            <option value="">Filtrar por Marca</option>
          </template>
        </b-form-select>
      </b-col>
      <b-col md="3">
        <b-form-select v-model="filterModelo" :options="modelos" class="mb-2">
          <template #first>
            <option value="">Filtrar por Modelo</option>
          </template>
        </b-form-select>
      </b-col>
      <b-col md="3">
        <b-form-select v-model="filterEstado" :options="estados" class="mb-2">
          <template #first>
            <option value="">Filtrar por Estado</option>
          </template>
        </b-form-select>
      </b-col>
    </b-row>

    <b-table :items="paginatedEquipos" :fields="fields" responsive striped hover small>
      <template #cell(acciones)="row">
        <b-button size="sm" title="Ver / Acciones" class="btn-icono"
          style="background-color: #4ecdc4; border-color: #4ecdc4;" @click="abrirModal(row.item)">
          <b-icon icon="receipt" font-scale="1" />
        </b-button>
      </template>
    </b-table>

    <b-pagination v-model="paginaActual" :total-rows="equiposFiltrados.length" :per-page="porPagina" align="center"
      class="mt-3" pills variant="primary" />

    <b-alert v-if="alertaVisible && alertaTipo === 'actualizado'" variant="success" dismissible
      @dismissed="alertaVisible = false">
      ¡Equipo actualizado correctamente!
    </b-alert>

    <b-alert v-if="alertaVisible && alertaTipo === 'eliminado'" variant="danger" dismissible
      @dismissed="alertaVisible = false">
      ¡Equipo eliminado exitosamente!
    </b-alert>

    <EquipoModal v-if="equipoSeleccionado" :equipo="equipoSeleccionado" @cerrar="cerrarModal" @editar="editarEquipo"
      @eliminar="eliminarEquipoSeleccionado" />
  </div>
</template>

<script>
import EquipoModal from '@/components/Equipos/EquipoModal.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'EquiposPage',
  components: {
    EquipoModal
  },
  data() {
    return {
      alertaVisible: false,
      alertaTipo: '',
      equipoSeleccionado: null,
      mostrarModal: false,
      search: '',
      filterMarca: '',
      filterModelo: '',
      filterEstado: '',
      paginaActual: 1,
      porPagina: 15,
      fields: [
        { key: 'id', label: 'ID', sortable: true, class: 'text-center' },
        { key: 'tipo', label: 'Tipo', sortable: true, class: 'text-center' },
        { key: 'nro_serie', label: 'Nro de Serie', sortable: true, class: 'text-center' },
        { key: 'marca', label: 'Marca', sortable: true, class: 'text-center' },
        { key: 'modelo', label: 'Modelo', sortable: true, class: 'text-center' },
        { key: 'fecha_mantencion', label: 'Fecha de Mantención', sortable: true, class: 'text-center' },
        { key: 'estado', label: 'Estado', sortable: true, class: 'text-center' },
        { key: 'acciones', label: 'Acciones', class: 'text-center' }
      ]
    }
  },
  created() {
    this.cargarEquipos()
    this.$store.dispatch('cargarClientes')
  },
  computed: {
    ...mapGetters(['obtenerEquipos']),
    equiposTotales() {
      return this.obtenerEquipos
    },
    equiposFiltrados() {
      return this.equiposTotales.filter(e => {
        const texto = `${e.id} ${e.marca} ${e.modelo} ${e.nro_serie}`.toLowerCase()
        return (
          texto.includes(this.search.toLowerCase()) &&
          (this.filterMarca ? e.marca === this.filterMarca : true) &&
          (this.filterModelo ? e.modelo === this.filterModelo : true) &&
          (this.filterEstado ? e.estado === this.filterEstado : true)
        )
      })
    },
    paginatedEquipos() {
      const start = (this.paginaActual - 1) * this.porPagina
      return this.equiposFiltrados.slice(start, start + this.porPagina)
    },
    marcas() {
      return [...new Set(this.obtenerEquipos.map(e => e.marca))].sort()
    },
    modelos() {
      return [...new Set(this.obtenerEquipos.map(e => e.modelo))].sort()
    },
    estados() {
      return [...new Set(this.obtenerEquipos.map(e => e.estado))].sort()
    }
  },
  methods: {
    ...mapActions(['cargarEquipos', 'actualizarEquipo', 'eliminarEquipo']),
    abrirModal(equipo) {
      this.equipoSeleccionado = equipo
      this.mostrarModal = true
      this.$root.$emit('bv::show::modal', 'modal-equipo')
    },
    cerrarModal() {
      this.mostrarModal = false
      this.equipoSeleccionado = null
    },
    async editarEquipo(equipo) {
      try {
        await this.actualizarEquipo(equipo)
        await this.cargarEquipos()
        this.cerrarModal()
        this.alertaTipo = 'actualizado'
        this.alertaVisible = true
      } catch (error) {
        console.error("Error al actualizar y recargar equipos:", error)
      }
    },
    async eliminarEquipoSeleccionado(equipo) {
      if (confirm(`¿Eliminar equipo ID ${equipo.id}?`)) {
        try {
          await this.$store.dispatch('eliminarEquipo', equipo.id)
          await this.cargarEquipos()
          this.cerrarModal()
          this.alertaTipo = 'eliminado'
          this.alertaVisible = true
        } catch (error) {
          console.error("Error al eliminar y recargar equipos:", error)
        }
      }
    }
  }
}
</script>