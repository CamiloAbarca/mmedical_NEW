<template>
    <div>
        <b-modal :id="modalId" title="Acciones" @hide="$emit('cerrar')" size="xl" ok-only>
            <b-container fluid>
                <b-form @submit.prevent="guardarCambios">
                    <b-row>
                        <b-col md="6" class="mb-3">
                            <b-form-group label="Estado" label-for="estado">
                                <b-form-select id="estado" v-model="editableEquipo.estado" :options="estadoOpciones" />
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="mb-3">
                            <b-form-group label="Fecha inicio de Periodo" label-for="fechaPeriodo">
                                <b-form-input id="fechaPeriodo" type="date" v-model="editableEquipo.fechaPeriodo" />
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="mb-3">
                            <b-form-group label="Fecha Entrega" label-for="fechaEntrega">
                                <b-form-input id="fechaEntrega" type="date" v-model="editableEquipo.fechaEntrega" />
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="mb-3">
                            <b-form-group label="Fecha Mantención" label-for="fechaMantencion">
                                <p class="font-weight-bold mb-0">{{ editableEquipo.fechaMantencion }}</p>
                            </b-form-group>
                        </b-col>


                        <b-col md="6" class="mb-3">
                            <b-form-group label="Accesorios" label-for="accesorios">
                                <b-form-textarea id="accesorios" v-model="editableEquipo.accesorios" rows="2" />
                            </b-form-group>
                        </b-col>

                        <b-col md="6" class="mb-3">
                            <b-form-group label="Detalles" label-for="detalles">
                                <b-form-textarea id="detalles" v-model="editableEquipo.detalles" rows="2" />
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <hr />
                    <div class="d-flex justify-content-end">
                        <b-button variant="success" type="submit" class="mr-2">Guardar cambios</b-button>
                        <b-button variant="danger" class="mr-2" @click="$emit('eliminar', editableEquipo)">Eliminar
                            equipo</b-button>
                        <b-button variant="dark" @click="mostrarHistorial = true">Historial</b-button>
                    </div>
                </b-form>
            </b-container>
        </b-modal>

        <b-modal id="modal-historial" v-model="mostrarHistorial" title="Historial del Equipo" size="lg" hide-footer>
            <b-container fluid>
                <b-table :items="historialEquipo" :fields="['fecha', 'detalle']" small bordered>
                    <template #cell(fecha)="data">
                        {{ new Date(data.item.fecha).toLocaleDateString() }}
                    </template>
                </b-table>
                <div v-if="historialEquipo.length === 0" class="text-center text-muted">
                    No hay historial disponible para este equipo.
                </div>
            </b-container>
        </b-modal>
    </div>
</template>


<script>
export default {
    name: 'EquipoModal',
    props: {
        equipo: Object,
        modalId: {
            type: String,
            default: 'modal-equipo'
        }
    },
    data() {
        return {
            mostrarHistorial: false,
            historialEquipo: [],
            editableEquipo: { ...this.equipo },
            estadoOpciones: [
                'En Revisión',
                'Cotizado',
                'OC Recibida',
                'Despachado',
                'Facturado',
                'Garantía'
            ]
        }
    },
    watch: {
        equipo: {
            handler(nuevo) {
                this.editableEquipo = { ...nuevo }
                this.actualizarFechaMantencion()
            },
            immediate: true
        },
        'editableEquipo.fechaPeriodo'() {
            this.actualizarFechaMantencion()
        },
        mostrarHistorial(nuevo) {
            if (nuevo) this.cargarHistorial()
        }
    },
    methods: {
        guardarCambios() {
            this.actualizarFechaMantencion()
            this.$emit('editar', this.editableEquipo)
            this.$emit('cerrar')
            this.$root.$emit('bv::hide::modal', this.modalId)
        },
        actualizarFechaMantencion() {
            if (!this.editableEquipo.fechaPeriodo) return

            const fechaPeriodo = new Date(this.editableEquipo.fechaPeriodo)
            const fechaMantencion = new Date(fechaPeriodo)
            fechaMantencion.setFullYear(fechaPeriodo.getFullYear() + 1)

            const yyyy = fechaMantencion.getFullYear()
            const mm = String(fechaMantencion.getMonth() + 1).padStart(2, '0')
            const dd = String(fechaMantencion.getDate()).padStart(2, '0')

            this.editableEquipo.fechaMantencion = `${dd}/${mm}/${yyyy}`
        },

        async cargarHistorial() {
            // Simulado: reemplaza por llamada a API si lo deseas
            this.historialEquipo = [
                { fecha: '2024-09-01', detalle: 'Cambio de batería' },
                { fecha: '2025-01-15', detalle: 'Revisión de calibración' }
            ]
        }
    }
}
</script>