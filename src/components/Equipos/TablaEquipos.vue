<template>
  <div>
    <h3 class="text-primary mb-3">Equipos</h3>

    <!-- Filtros -->
    <b-row class="mb-3">
      <b-col md="3">
        <b-form-input v-model="search" placeholder="Buscar por ID, Marca, Modelo, Serie" />
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

    <!-- Tabla -->
    <b-table :items="paginatedEquipos" :fields="fields" responsive striped hover small>
      <template #cell(acciones)="row">
        <b-button size="sm" title="Ver / Acciones" class="btn-icono"
          style="background-color: #4ecdc4; border-color: #4ecdc4;" @click="abrirModal(row.item)">
          <b-icon icon="receipt" font-scale="1" />
        </b-button>
      </template>

    </b-table>

    <!-- Paginación -->
    <b-pagination v-model="paginaActual" :total-rows="equiposFiltrados.length" :per-page="porPagina" align="center"
      class="mt-3" pills variant="primary" />

    <EquipoModal v-if="equipoSeleccionado" :equipo="equipoSeleccionado" @cerrar="cerrarModal" @editar="editarEquipo"
      @eliminar="eliminarEquipo" />

  </div>
</template>

<script>
import EquipoModal from '@/components/Equipos/EquipoModal.vue'


export default {
  name: 'EquiposPage',
  components: {
    EquipoModal
  },
  data() {
    return {
      equipoSeleccionado: null,
      mostrarModal: false,
      search: '',
      filterMarca: '',
      filterModelo: '',
      filterEstado: '',
      paginaActual: 1,
      porPagina: 15,
      equipos: [
        {
          id: 1,
          serie: 'ABC123',
          marca: 'GE',
          modelo: 'X200',
          revision: '2025-01-10',
          estado: 'Activo'
        },
        {
          id: 2,
          serie: 'XYZ456',
          marca: 'Philips',
          modelo: 'UltraScan',
          revision: '2025-04-01',
          estado: 'Inactivo'
        }
      ],
      fields: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'serie', label: 'Nro de Serie', sortable: true },
        { key: 'marca', label: 'Marca', sortable: true },
        { key: 'modelo', label: 'Modelo', sortable: true },
        { key: 'revision', label: 'Fecha de Revisión', sortable: true },
        { key: 'estado', label: 'Estado', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ]
    }
  },
  props: {
    nuevosEquipos: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    equiposTotales() {
      return [...this.equipos, ...this.nuevosEquipos]
    },
    equiposFiltrados() {
      return this.equiposTotales.filter(e => {
        const texto = `${e.id} ${e.marca} ${e.modelo} ${e.serie}`.toLowerCase()
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
      return [...new Set(this.equipos.map(e => e.marca))].sort()
    },
    modelos() {
      return [...new Set(this.equipos.map(e => e.modelo))].sort()
    },
    estados() {
      return [...new Set(this.equipos.map(e => e.estado))].sort()
    }
  },
  methods: {
    abrirModal(equipo) {
      this.equipoSeleccionado = equipo
      this.mostrarModal = true
      this.$root.$emit('bv::show::modal', 'modal-equipo')
    },

    cerrarModal() {
      this.mostrarModal = false
      this.equipoSeleccionado = null
    },

    editarEquipo(equipoActualizado) {
      const index = this.equipos.findIndex(e => e.id === equipoActualizado.id)
      if (index !== -1) {
        this.equipos.splice(index, 1, equipoActualizado)
      } else {
        // Emitir evento para que el padre actualice nuevosEquipos
        this.$emit('actualizar-nuevo-equipo', equipoActualizado)
      }
    },

    eliminarEquipo(equipo) {
      if (confirm(`¿Eliminar equipo ID ${equipo.id}?`)) {
        this.equipos = this.equipos.filter(e => e.id !== equipo.id)
        this.cerrarModal()
      }
    }

  }
}
</script>

<style scoped>
.acciones-botones>*:not(:last-child) {
  margin-right: 6px;
}

.btn-icono {
  padding: 0.25rem 0.4rem;
  line-height: 1;
  border-radius: 0.25rem;
}
</style>
