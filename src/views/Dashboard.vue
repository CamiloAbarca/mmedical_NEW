<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4 text-primary">Dashboard de Equipos</h2>

    <!-- Tarjetas resumen -->
    <b-row class="mb-4">
      <b-col md="3" v-for="card in resumenCards" :key="card.label">
        <b-card class="text-white text-center" :bg-variant="card.color" body-class="p-3">
          <h4>{{ card.valor }}</h4>
          <p class="mb-0">{{ card.label }}</p>
        </b-card>
      </b-col>
    </b-row>

    <!-- Gráfico de barras -->
    <b-row>
      <b-col md="6">
        <b-card title="Equipos por Estado" class="mb-4">
          <bar-chart :datos="datosGrafico" />
        </b-card>
      </b-col>

      <!-- Tabla -->
      <b-col md="6">
        <b-card title="Últimos Equipos Ingresados">
          <b-table :items="ultimosEquipos" :fields="camposTabla" small striped hover responsive />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// Requiere BarChart.vue (definido abajo)
import BarChart from '@/components/Dashboard/BarChart.vue'

export default {
  name: 'DashboardView',
  components: {
    BarChart
  },
  data() {
    return {
      resumenCards: [
        { label: 'Total Equipos', valor: 123, color: 'primary' },
        { label: 'Facturados', valor: 45, color: 'success' },
        { label: 'Pronto a revisión', valor: 10, color: 'warning' },
        { label: 'Necesitan revisión', valor: 5, color: 'danger' }
      ],
      ultimosEquipos: [
        { id: 1, marca: 'HP', modelo: 'ZBook', estado: 'En Revisión' },
        { id: 2, marca: 'Dell', modelo: 'Latitude', estado: 'Facturado' },
        { id: 3, marca: 'Lenovo', modelo: 'ThinkPad', estado: 'Garantía' }
      ],
      camposTabla: [
        { key: 'id', label: 'ID' },
        { key: 'marca', label: 'Marca' },
        { key: 'modelo', label: 'Modelo' },
        { key: 'estado', label: 'Estado' }
      ],
      datosGrafico: {
        labels: ['En Revisión', 'Facturado', 'Garantía', 'Despachado'],
        datasets: [
          {
            label: 'Equipos',
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
            data: [12, 45, 10, 6]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
