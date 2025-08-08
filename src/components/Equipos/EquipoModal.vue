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
                <b-skeleton-table
                    v-if="cargandoHistorial"
                    :rows="5"
                    :columns="2"
                    animation="wave"
                    class="mb-3"
                />
                <b-table
                    v-else
                    :items="historialPaginado"
                    :fields="['fecha', 'detalle']"
                    small
                    bordered
                >
                    <template #cell(fecha)="row">
                        {{ formatearFecha(row.item.fecha) }}
                    </template>
                    <template #cell(detalle)="row">
                        <ul class="mb-0 pl-3">
                            <li v-for="(cambio, idx) in separarCambios(row.item.detalle)" :key="idx">
                                {{ cambio.trim() }}
                            </li>
                        </ul>
                    </template>
                </b-table>
                <div v-if="!cargandoHistorial && historialEquipo.length === 0" class="text-center text-muted">
                    No hay historial disponible para este equipo.
                </div>
                <b-pagination
                    v-if="!cargandoHistorial && totalPaginasHistorial > 1"
                    v-model="paginaHistorial"
                    :total-rows="historialEquipo.length"
                    :per-page="elementosPorPagina"
                    align="center"
                    class="mt-2"
                />
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
            ],
            paginaHistorial: 1, // NUEVO: página actual
            elementosPorPagina: 5, // NUEVO: elementos por página
            cargandoHistorial: false
        }
    },
    computed: {
        historialPaginado() {
            const inicio = (this.paginaHistorial - 1) * this.elementosPorPagina;
            const fin = inicio + this.elementosPorPagina;
            return this.historialEquipo.slice(inicio, fin);
        },
        totalPaginasHistorial() {
            return Math.ceil(this.historialEquipo.length / this.elementosPorPagina);
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
        },
        historialEquipo() {
            this.paginaHistorial = 1; // Reinicia a la primera página al cargar historial
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
            // No cerrar el modal aquí
            // this.$emit('cerrar');
            // this.$root.$emit('bv::hide::modal', this.modalId);

            // Mostrar toast de éxito
            this.$bvToast.toast('¡Cambios guardados correctamente!', {
                title: 'Éxito',
                variant: 'success',
                solid: true,
                autoHideDelay: 3000
            });
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
            this.cargandoHistorial = true;
            let historial = await this.$store.dispatch('cargarHistorial', this.equipo.id);
            this.historialEquipo = historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            this.cargandoHistorial = false;
        },
        separarCambios(detalle) {
            if (!detalle) return [];
            return detalle.split(',');
        }
    }
};
</script>