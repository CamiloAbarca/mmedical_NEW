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

    <b-skeleton-table
      v-if="cargandoEquipos"
      :rows="10"
      :columns="fields.length"
      animation="wave"
      class="mb-3"
    />
    <b-table
      v-else
      :items="paginatedEquipos"
      :fields="fields"
      responsive
      striped
      hover
      small
    >
      <template #cell(fecha_mantencion)="row">
        <span :class="{ 'text-danger font-weight-bold': esFechaProxima(row.item.fecha_mantencion) }">
          {{ formatearFecha(row.item.fecha_mantencion) }}
        </span>
      </template>
      <template #cell(acciones)="row">
        <b-button size="sm" title="Ver / Acciones" class="btn-icono"
          style="background-color: #4ecdc4; border-color: #4ecdc4;" @click="abrirModal(row.item)">
          <b-icon icon="receipt" font-scale="1" />
        </b-button>
      </template>
    </b-table>

    <b-pagination
      v-if="!cargandoEquipos"
      v-model="paginaActual"
      :total-rows="equiposFiltrados.length"
      :per-page="porPagina"
      align="center"
      class="mt-3"
      pills
      variant="primary"
    />

    <b-alert v-if="alertaVisible && alertaTipo === 'actualizado'" variant="success" dismissible
      @dismissed="alertaVisible = false">
      ¡Equipo actualizado correctamente!
    </b-alert>

    <b-alert
      v-if="alertaVisible && alertaTipo === 'eliminado'"
      variant="danger"
      dismissible
      @dismissed="alertaVisible = false"
      show
      class="d-flex align-items-center py-3 px-4"
      style="font-size: 1.1rem;"
    >
      <b-icon
        icon="exclamation-triangle-fill"
        variant="danger"
        font-scale="2"
        class="mr-3 flex-shrink-0"
      />
      <div>
        <div class="font-weight-bold mb-1">¡Equipo eliminado exitosamente!</div>
        <div class="small text-danger">Esta acción <span class="font-weight-bold">no se puede deshacer</span>.</div>
      </div>
    </b-alert>

    <EquipoModal v-if="equipoSeleccionado" :equipo="equipoSeleccionado" @cerrar="cerrarModal" @editar="editarEquipo"
      @eliminar="eliminarEquipoSeleccionado" />

    <b-modal
      id="modal-confirmar-eliminar"
      ref="modalConfirmarEliminar"
      title="¿Eliminar equipo?"
      ok-title="Sí, eliminar"
      cancel-title="Cancelar"
      ok-variant="danger"
      cancel-variant="secondary"
      centered
      @ok="confirmarEliminarEquipo"
    >
      <div class="d-flex align-items-center">
        <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2" class="mr-3"/>
        <div>
          <div class="font-weight-bold mb-2 text-danger">¿Estás seguro que deseas eliminar este equipo?</div>
          <div class="small text-muted">Esta acción <span class="font-weight-bold">no se puede deshacer</span>.</div>
        </div>
      </div>
    </b-modal>
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
      cargandoEquipos: true, // NUEVO
      equipoAEliminar: null,
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
  async created() {
    await this.cargarEquiposConSkeleton();
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
    async cargarEquiposConSkeleton() {
      this.cargandoEquipos = true;
      await this.cargarEquipos();
      this.cargandoEquipos = false;
    },
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
        // Actualizar localmente el equipo en Vuex (si tienes un mutation directa)
        const index = this.obtenerEquipos.findIndex(e => e.id === equipo.id)
        if (index !== -1) {
          this.obtenerEquipos.splice(index, 1, { ...equipo })
        }
        // this.cerrarModal() // <-- Quita o comenta esta línea
        this.alertaTipo = 'actualizado'
        this.alertaVisible = true
      } catch (error) {
        console.error("Error al actualizar:", error)
      }
    },
    eliminarEquipoSeleccionado(equipo) {
      this.equipoAEliminar = equipo;
      this.$refs.modalConfirmarEliminar.show();
    },
    async confirmarEliminarEquipo() {
      if (!this.equipoAEliminar) return;
      try {
        await this.eliminarEquipo(this.equipoAEliminar.id);
        this.alertaTipo = 'eliminado';
        this.alertaVisible = true;
        this.equipoAEliminar = null;
        this.cerrarModal();
      } catch (error) {
        this.$bvToast.toast('Error al eliminar el equipo.', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      }
    },
    formatearFecha(fechaString) {
      if (!fechaString) return '';
      const fecha = new Date(fechaString);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      return `${dia}/${mes}/${anio}`;
    },

    esFechaProxima(fechaString) {
      if (!fechaString) return false;
      const fechaMantencion = new Date(fechaString);
      const hoy = new Date();
      const dosSemanasEnMilisegundos = 14 * 24 * 60 * 60 * 1000;
      const diferencia = fechaMantencion.getTime() - hoy.getTime();
      return diferencia > 0 && diferencia <= dosSemanasEnMilisegundos;
    }
  }
}
</script>