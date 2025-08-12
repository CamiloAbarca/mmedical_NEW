<template>
    <b-modal :id="modalId" title="Información Completa del Equipo" size="lg" ok-only ok-title="Cerrar"
        @hide="$emit('cerrar')" @shown="onShown">
        <!-- Botón para exportar a PDF -->
        <div class="text-right mb-2">
            <b-button variant="danger" size="sm" @click="generarPDF">
                <i class="fas fa-file-pdf mr-1"></i> Generar PDF
            </b-button>
        </div>

        <!-- Contenido a imprimir/exportar -->
        <div v-if="equipo" id="contenido-a-imprimir">
            <!-- Cliente -->
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

            <!-- Equipo -->
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

            <!-- Historial -->
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
                margin: 0.5,
                filename: `equipo_${this.equipo?.id || "info"}.pdf`,
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
.pdf-page-break {
    page-break-before: always;
}
</style>
