<template>
    <b-modal :id="modalId" title="Detalles del Equipo" @hide="$emit('cerrar')" size="xl" ok-only>
        <b-container fluid>
            <b-form @submit.prevent="guardarCambios">
                <b-row>
                    <b-col md="6" class="mb-3">
                        <b-form-group label="ID" label-for="id">
                            <b-form-input id="id" v-model="editableEquipo.id" disabled />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="mb-3">
                        <b-form-group label="Marca" label-for="marca">
                            <b-form-input id="marca" v-model="editableEquipo.marca" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="mb-3">
                        <b-form-group label="Modelo" label-for="modelo">
                            <b-form-input id="modelo" v-model="editableEquipo.modelo" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="mb-3">
                        <b-form-group label="Serie" label-for="serie">
                            <b-form-input id="serie" v-model="editableEquipo.serie" />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="mb-3">
                        <b-form-group label="Estado" label-for="estado">
                            <b-form-select id="estado" v-model="editableEquipo.estado" :options="estadoOpciones" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="6" class="mb-3">
                        <b-form-group label="Fecha Ingreso" label-for="fechaIngreso">
                            <b-form-input id="fechaIngreso" type="date" v-model="editableEquipo.fechaIngreso" />
                        </b-form-group>
                    </b-col>
                    <b-col md="6" class="mb-3">
                        <b-form-group label="Fecha Entrega" label-for="fechaEntrega">
                            <b-form-input id="fechaEntrega" type="date" v-model="editableEquipo.fechaEntrega" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="12" class="mb-3">
                        <b-form-group label="Accesorios" label-for="accesorios">
                            <b-form-textarea id="accesorios" v-model="editableEquipo.accesorios" rows="2" />
                        </b-form-group>
                    </b-col>
                    <b-col md="12" class="mb-3">
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
            },
            immediate: true
        }
    },
    methods: {
        guardarCambios() {
            this.$emit('editar', this.editableEquipo)
            this.$emit('cerrar')
            this.$root.$emit('bv::hide::modal', this.modalId)
        }
    }
}
</script>