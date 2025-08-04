<template>
    <b-modal :id="modalId" title="Detalles del Equipo" @hide="$emit('cerrar')" size="xl" ok-only>
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
                    <b-button variant="danger" @click="$emit('eliminar', editableEquipo)">Eliminar equipo</b-button>
                </div>
            </b-form>
        </b-container>
    </b-modal>
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
        }
    }
}
</script>