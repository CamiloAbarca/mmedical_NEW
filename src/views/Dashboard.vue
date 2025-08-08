<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4 text-primary">Dashboard de Equipos</h2>

    <b-row class="mb-4">
      <b-col md="4" v-for="card in resumenCards" :key="card.label">
        <b-card class="text-white text-center" :bg-variant="card.color" body-class="p-3">
          <h4>{{ card.valor }}</h4>
          <p class="mb-0">{{ card.label }}</p>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-card title="Equipos por Estado" class="mb-4">
          <bar-chart :datos="datosGrafico" />
        </b-card>
      </b-col>

      <b-col md="6">
        <b-card title="Últimos Equipos Ingresados" class="mb-4">
          <b-table :items="ultimosEquipos" :fields="camposTabla" small striped hover responsive />
        </b-card>

        <b-card title="Equipos que necesitan revisión" class="mt-4">
          <b-table :items="equiposNecesitanRevisionTabla" :fields="camposTablaRevision" small striped hover responsive>
            <template #cell(fecha_mantencion)="row">
              {{ formatearFecha(row.item.fecha_mantencion) }}
            </template>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BarChart from '@/components/Dashboard/BarChart.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DashboardView',
  components: {
    BarChart,
  },
  data() {
    return {
      camposTabla: [
        { key: 'id', label: 'ID' },
        { key: 'marca', label: 'Marca' },
        { key: 'modelo', label: 'Modelo' },
        { key: 'estado', label: 'Estado' },
      ],
      camposTablaRevision: [
        { key: 'id', label: 'ID' },
        { key: 'nro_serie', label: 'Nro Serie' },
        { key: 'marca', label: 'Marca' },
        { key: 'fecha_mantencion', label: 'Mantención' },
      ],
    };
  },
  computed: {
    ...mapGetters(['obtenerEquipos']),

    totalEquipos() {
      return this.obtenerEquipos.length;
    },

    equiposFacturados() {
      return this.obtenerEquipos.filter(e => e.estado === 'Facturado').length;
    },

    equiposNecesitanRevision() {
      const hoy = new Date();
      const dosSemanasEnMilisegundos = 14 * 24 * 60 * 60 * 1000;
      return this.obtenerEquipos.filter(e => {
        if (!e.fecha_mantencion) return false;
        const fechaMantencion = new Date(e.fecha_mantencion);
        const diferencia = fechaMantencion.getTime() - hoy.getTime();
        return diferencia > 0 && diferencia <= dosSemanasEnMilisegundos;
      }).length;
    },

    equiposNecesitanRevisionTabla() {
      const hoy = new Date();
      const dosSemanasEnMilisegundos = 14 * 24 * 60 * 60 * 1000;
      return this.obtenerEquipos.filter(e => {
        if (!e.fecha_mantencion) return false;
        const fechaMantencion = new Date(e.fecha_mantencion);
        const diferencia = fechaMantencion.getTime() - hoy.getTime();
        return diferencia > 0 && diferencia <= dosSemanasEnMilisegundos;
      });
    },

    resumenCards() {
      return [
        { label: 'Total Equipos', valor: this.totalEquipos, color: 'primary' },
        { label: 'Facturados', valor: this.equiposFacturados, color: 'success' },
        { label: 'Necesitan revisión', valor: this.equiposNecesitanRevision, color: 'danger' },
      ];
    },

    ultimosEquipos() {
      return [...this.obtenerEquipos].sort((a, b) => b.id - a.id).slice(0, 5);
    },

    datosGrafico() {
      const estados = {
        'En Revisión': 0,
        'Cotizado': 0,
        'OC Recibida': 0,
        'Despachado': 0,
        'Facturado': 0,
        'Garantía': 0,
      };

      this.obtenerEquipos.forEach(equipo => {
        if (Object.prototype.hasOwnProperty.call(estados, equipo.estado)) {
          estados[equipo.estado]++;
        }
      });

      estados['Necesitan revisión'] = this.equiposNecesitanRevision;

      const labels = Object.keys(estados);
      const data = Object.values(estados);

      const backgroundColor = [
        '#4ecdc4', '#81D8D0', '#A9E4D8', '#66CDAA', '#28a745', '#33CC99', '#dc3545'
      ];

      return {
        labels: labels,
        datasets: [{
          label: 'Equipos',
          backgroundColor: backgroundColor,
          data: data,
        }],
      };
    },
  },
  created() {
    this.cargarEquipos();
  },
  methods: {
    ...mapActions(['cargarEquipos']),
    formatearFecha(fecha) {
      if (!fecha) return '';
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return '';
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const anio = d.getFullYear();
      return `${dia}/${mes}/${anio}`;
    }
  },
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>