<template>
    <div>
        <canvas ref="barCanvas" />
    </div>
</template>

<script>
import Chart from 'chart.js'

export default {
    name: 'BarChart',
    props: {
        datos: Object
    },
    mounted() {
        new Chart(this.$refs.barCanvas, {
            type: 'bar',
            data: this.datos,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { beginAtZero: true } }]
                }
            }
        })
    }
}
</script>

<style scoped>
canvas {
    width: 100% !important;
    height: 300px !important;
}
</style>
