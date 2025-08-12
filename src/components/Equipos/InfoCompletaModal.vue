<template>
    <b-modal :id="modalId" title="Información Completa del Equipo" size="lg" ok-only ok-title="Cerrar"
        @hide="$emit('cerrar')" @shown="onShown">
        <div class="text-right mb-2">
            <b-button variant="danger" size="sm" @click="generarPDF">
                <i class="fas fa-file-pdf mr-1"></i> Generar PDF
            </b-button>
        </div>

        <div v-if="equipo" id="contenido-a-imprimir" class="pdf-styled-container">
            <div class="pdf-header mb-4">
                <img src="@/assets/logo.png" alt="Mmedical Logo" class="pdf-logo" />
                <h4 class="pdf-title mt-2">Informe Completo de Equipo</h4>
            </div>

            <b-card class="mb-3" header="Datos del Cliente" header-tag="h5">
                <template v-if="cliente">
                    <b-list-group flush>
                        <b-list-group-item><b>Razón Social:</b> {{ cliente.razonSocial }}</b-list-group-item>
                        <b-list-group-item><b>Centro Médico:</b> {{ cliente.centroMedico }}</b-list-group-item>
                    </b-list-group>
                </template>
                <template v-else>
                    <i>No se encontró información del cliente.</i>
                </template>
            </b-card>

            <b-card class="mb-3" header="Datos del Equipo" header-tag="h5">
                <b-list-group flush>
                    <b-list-group-item><b>Tipo:</b> {{ equipo.tipo }}</b-list-group-item>
                    <b-list-group-item><b>Marca:</b> {{ equipo.marca }}</b-list-group-item>
                    <b-list-group-item><b>Modelo:</b> {{ equipo.modelo }}</b-list-group-item>
                    <b-list-group-item><b>Nro. Serie:</b> {{ equipo.nro_serie }}</b-list-group-item>
                    <b-list-group-item><b>Estado:</b> {{ equipo.estado }}</b-list-group-item>
                    <b-list-group-item><b>Fecha Ingreso:</b> {{ formatDate(equipo.fecha_ingreso) }}</b-list-group-item>
                    <b-list-group-item><b>Fecha Entrega:</b> {{ formatDate(equipo.fecha_entrega) }}</b-list-group-item>
                    <b-list-group-item><b>Fecha Mantención:</b> {{ formatDate(equipo.fecha_mantencion)
                    }}</b-list-group-item>
                    <b-list-group-item><b>Fecha Periodo:</b> {{ formatDate(equipo.fecha_periodo) }}</b-list-group-item>
                    <b-list-group-item><b>Accesorios:</b> {{ equipo.accesorios }}</b-list-group-item>
                    <b-list-group-item><b>Detalle:</b> {{ equipo.detalle }}</b-list-group-item>
                </b-list-group>
            </b-card>

            <div class="pdf-page-break">
                <b-card header="Historial del Equipo" header-tag="h5">
                    <b-table v-if="historial.length" :items="historial" :fields="historialFields" small bordered
                        responsive>
                        <template #cell(fecha)="row">
                            {{ formatDate(row.item.fecha || row.item.created_at) }}
                        </template>
                        <template #cell(detalle)="row">
                            {{ getDetalle(row.item) }}
                        </template>
                    </b-table>
                    <div v-else>
                        <i>Este equipo no tiene historial registrado.</i>
                    </div>
                </b-card>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import html2pdf from "html2pdf.js";

export default {
    name: "InfoCompletaModal",
    props: {
        equipo: { type: Object, default: null },
        modalId: { type: String, default: "modal-info-equipo" },
    },
    data() {
        return {
            historial: [],
            historialFields: [
                { key: "fecha", label: "Fecha" },
                { key: "detalle", label: "Detalle" },
            ],
        };
    },
    computed: {
        ...mapGetters(["obtenerClientes"]),
        cliente() {
            if (this.equipo?.id_cliente) {
                return this.obtenerClientes.find(c => c.id === this.equipo.id_cliente) || null;
            }
            return null;
        },
    },
    methods: {
        async onShown() {
            if (!this.equipo) return;
            await this.loadHistorial();
        },
        async loadHistorial() {
            try {
                const h = await this.$store.dispatch("cargarHistorial", this.equipo.id);
                this.historial = Array.isArray(h) ? h : [];
            } catch {
                this.historial = [];
            }
        },
        formatDate(date) {
            if (!date) return "—";
            return new Date(date).toLocaleDateString("es-CL");
        },
        getDetalle(item) {
            return item.detalle || item.descripcion || "-";
        },
        generarPDF() {
            const element = document.getElementById("contenido-a-imprimir");
            const opt = {
                margin: 0.2,
                filename: `equipo_${this.equipo?.id || "info"}_informe.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };
            html2pdf().from(element).set(opt).save();
        },
    },
};
</script>

<style scoped>
.pdf-styled-container {
    padding: 1rem;
    font-family: Arial, sans-serif;
}

.pdf-header {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #556270;
    padding-bottom: 1rem;
}

.pdf-logo {
    height: 60px;
    margin-right: 1.5rem;
}

.pdf-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #4ecdc4;
    margin: 0;
}

.b-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.b-card>>>.card-header {
    background-color: #556270 !important;
    color: #fff !important;
    font-weight: bold;
    padding: 0.75rem 1.25rem;
}

.b-list-group-item {
    padding: 0.5rem 1.25rem;
    border: none;
    border-bottom: 1px solid #eee;
}

.pdf-page-break {
    page-break-before: always;
}
</style>