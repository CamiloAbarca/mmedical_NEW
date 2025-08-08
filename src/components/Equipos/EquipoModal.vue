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
                            <b-form-group label="Fecha Mantención" label-for="fecha_mantencion">
                                <p class="font-weight-bold mb-0">{{ formatearFecha(editableEquipo.fecha_mantencion) }}
                                </p>
                            </b-form-group>
                        </b-col>
                        <b-col md="6" class="mb-3">
                            <b-form-group label="Fecha inicio de Periodo" label-for="fecha_periodo">
                                <b-form-input id="fecha_periodo" type="date" v-model="editableEquipo.fecha_periodo" />
                            </b-form-group>
                        </b-col>
                        <b-col md="6" class="mb-3">
                            <b-form-group label="Fecha Entrega" label-for="fecha_entrega">
                                <b-form-input id="fecha_entrega" type="date" v-model="editableEquipo.fecha_entrega" />
                            </b-form-group>
                        </b-col>
                        <b-col md="6" class="mb-3">
                            <b-form-group label="Accesorios" label-for="accesorios">
                                <b-form-textarea id="accesorios" v-model="editableEquipo.accesorios" rows="2" />
                            </b-form-group>
                        </b-col>
                        <b-col md="6" class="mb-3">
                            <b-form-group label="Detalles" label-for="detalle">
                                <b-form-textarea id="detalle" v-model="editableEquipo.detalle" rows="2" />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <hr />
                    <div class="d-flex justify-content-end">
                        <b-button variant="success" type="submit" class="mr-2">Guardar cambios</b-button>
                        <b-button variant="danger" class="mr-2" @click="$emit('eliminar', editableEquipo)">
                            Eliminar equipo
                        </b-button>
                        <b-button variant="dark" @click="mostrarHistorial = true">Historial</b-button>
                    </div>
                </b-form>
            </b-container>
        </b-modal>

        <b-modal id="modal-historial" v-model="mostrarHistorial" title="Historial del Equipo" size="lg" hide-footer>
            <b-container fluid>
                <b-table :items="historialEquipo" :fields="['fecha', 'detalle']" small bordered>
                    <template #cell(fecha)="row">
                        {{ formatearFecha(row.item.fecha) }}
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
import { mapActions } from 'vuex';

export default {
    name: 'EquipoModal',
    props: {
        equipo: {
            type: Object,
            default: () => ({})
        },
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
                if (nuevo) {
                    this.editableEquipo = { ...nuevo };
                    this.editableEquipo.fecha_periodo = this.normalizarFechaParaInput(this.editableEquipo.fecha_periodo);
                    this.editableEquipo.fecha_entrega = this.normalizarFechaParaInput(this.editableEquipo.fecha_entrega);
                    this.actualizarFechaMantencion();
                }
            },
            immediate: true
        },
        'editableEquipo.fecha_periodo'() {
            this.actualizarFechaMantencion();
        },
        mostrarHistorial(nuevo) {
            if (nuevo && this.equipo && this.equipo.id) {
                this.cargarHistorial();
            }
        }
    },
    methods: {
        ...mapActions(['cargarHistorial']),
        guardarCambios() {
            const equipoAEnviar = {
                ...this.editableEquipo,
                fecha_periodo: this.editableEquipo.fecha_periodo,
                fecha_entrega: this.editableEquipo.fecha_entrega,
                fecha_mantencion: this.editableEquipo.fecha_mantencion,
            };
            this.$emit('editar', equipoAEnviar);
            this.$emit('cerrar');
            this.$root.$emit('bv::hide::modal', this.modalId);
        },
        actualizarFechaMantencion() {
            if (!this.editableEquipo.fecha_periodo) {
                this.editableEquipo.fecha_mantencion = null;
                return;
            }
            const [year, month, day] = this.editableEquipo.fecha_periodo.split('-').map(Number);
            const fecha_periodo = new Date(year, month - 1, day);
            if (isNaN(fecha_periodo.getTime())) {
                this.editableEquipo.fecha_mantencion = null;
                return;
            }
            const fecha_mantencion = new Date(fecha_periodo);
            fecha_mantencion.setFullYear(fecha_periodo.getFullYear() + 1);
            const yyyy = fecha_mantencion.getFullYear();
            const mm = String(fecha_mantencion.getMonth() + 1).padStart(2, '0');
            const dd = String(fecha_mantencion.getDate()).padStart(2, '0');
            this.editableEquipo.fecha_mantencion = `${yyyy}-${mm}-${dd}`;
        },
        formatearFecha(fecha) {
            if (!fecha) return '';
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return '';
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const anio = d.getFullYear();
            return `${dia}/${mes}/${anio}`;
        },
        normalizarFechaParaInput(fecha) {
            if (!fecha) return null;
            const d = new Date(fecha);
            if (isNaN(d.getTime())) return null;
            return d.toISOString().split('T')[0];
        },
        async cargarHistorial() {
            this.historialEquipo = await this.$store.dispatch('cargarHistorial', this.equipo.id);
        }
    }
};
</script>