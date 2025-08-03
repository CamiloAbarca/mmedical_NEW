<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <b-button variant="primary" @click="mostrarModal = true" style="background-color: #4ecdc4; border-color: #4ecdc4">
        <b-icon icon="plus-circle" class="me-1" />
        Agregar Equipo
      </b-button>
    </div>

    <!-- Tabla de Equipos -->
    <TablaEquipos :nuevos-equipos="nuevosEquipos" />

    <!-- Modal para agregar equipo -->
    <b-modal id="modal-agregar-equipo" v-model="mostrarModal" title="Agregar Nuevo Equipo" @hide="resetFormulario"
      hide-footer centered size="lg" :header-style="{ backgroundColor: '#556270', color: 'white' }">
      <b-form @submit.prevent="guardarEquipo" ref="form">

        <b-row>
          <b-col md="6">
            <b-form-group label="Tipo Equipo" label-for="tipo">
              <b-form-select id="tipo" v-model="form.tipo" :options="['Humano', 'Veterinario']" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Marca" label-for="marca">
              <b-form-select id="marca" v-model="form.marca" :options="marcasDisponibles" required>
                <template #first>
                  <option disabled value="">-- Seleccione Marca --</option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Modelo" label-for="modelo">
              <b-form-select id="modelo" v-model="form.modelo" :options="modelosDisponibles" required>
                <template #first>
                  <option disabled value="">-- Seleccione Modelo --</option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="form.tipo && form.marca && form.modelo">
          <b-col md="6">
            <b-form-group label="Nro. Serie" label-for="serie">
              <b-form-input id="serie" v-model.trim="form.serie" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Estado" label-for="estado">
              <b-form-select id="estado" v-model="form.estado" :options="estados" required>
                <template #first>
                  <option disabled value="">-- Seleccione Estado --</option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Fecha Ingreso" label-for="fechaIngreso">
              <b-form-input id="fechaIngreso" type="date" v-model="form.fechaIngreso" required />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Fecha Entrega" label-for="fechaEntrega">
              <b-form-input id="fechaEntrega" type="date" v-model="form.fechaEntrega" required />
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group label="Accesorios" label-for="accesorios">
              <b-form-textarea id="accesorios" v-model="form.accesorios" rows="3"
                placeholder="Ej: Cable, Cargador, etc." />
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group label="Detalles" label-for="detalles">
              <b-form-textarea id="detalles" v-model="form.detalles" rows="3"
                placeholder="Ej: Piezas sulfatadas." />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- Botones -->
        <div class="text-end mt-3">
          <b-button type="submit" style="background-color: #c7f464; border-color: #c7f464; color: #333" class="me-2">
            Guardar
          </b-button>
          <b-button variant="danger" style="background-color: #ff6b6b; border-color: #ff6b6b" @click="cerrarModal">
            Cancelar
          </b-button>
        </div>
      </b-form>
    </b-modal>

  </div>
</template>

<script>
import TablaEquipos from '@/components/Equipos/TablaEquipos.vue'

export default {
  name: 'EquiposView',
  components: {
    TablaEquipos
  },
  data() {
    return {
      mostrarModal: false,
      nuevosEquipos: [],
      form: {
        tipo: '',
        marca: '',
        modelo: '',
        serie: '',
        estado: '',
        fechaIngreso: '',
        fechaEntrega: ''
      },
      camposValidados: false,
      estados: [
        'En Revisión',
        'Cotizado',
        'OC Recibida',
        'Despachado',
        'Facturado',
        'Garantía'
      ],
      equiposData: {
        Humano: {
          Aerotel: ['HeartView 12 l'],
          Biester: ['E-27-M'],
          BTL: ['4625 Premiun', 'BTL6000 SHORTWAVE'],
          Cardiocare: ['Cardio Care 2000'],
          DATASCOPE: ['PASSPORT2'],
          Econet: ['Proview 10L', 'Proview 10'],
          'Enraf Nonius': ['C-5', 'Endomed 982*', 'SONOPULS 490'],
          IEM: ['MOG NG'],
          meditech: ['abpm-04'],
          Mortara: ['H3+', 'TMX428220'],
          Norav: ['NR302', 'NR307', 'NR317', 'W1200'],
          'Nort East Monitoring': ['DR200'],
          Spacelabs: ['90207'],
          SUNTECH: ['oscar 2', 'bravo mini', 'bravo'],
          'Track Master': ['TM4'],
          Trismed: ['WT3000 TSM', 'Cardipia 800H'],
          Whitehall: ['ET8']
        },
        Veterinario: {
          SUNTECH: ['VET 25E', 'VET 20', 'VET 25', 'VET 30E', 'VET 40', 'VET30'],
          Edan: ['X10 VET', 'Acclarix']
        }
      }
    }
  },
  computed: {
    marcasDisponibles() {
      return this.form.tipo
        ? Object.keys(this.equiposData[this.form.tipo])
        : []
    },
    modelosDisponibles() {
      return this.form.tipo && this.form.marca
        ? this.equiposData[this.form.tipo][this.form.marca]
        : []
    }
  },
  methods: {
    validarCampo(campo) {
      if (!this.camposValidados) return null
      return this.form[campo] ? true : false
    },
    guardarEquipo() {
      this.camposValidados = true;

      // Validar que tipo, marca y modelo estén seleccionados
      const basicosCompletos = this.form.tipo && this.form.marca && this.form.modelo;

      // Si los campos básicos no están completos, no continuar
      if (!basicosCompletos) return;

      // Validar campos condicionales (solo si se muestra la sección)
      const camposExtrasCompletos =
        this.form.serie &&
        this.form.estado &&
        this.form.fechaIngreso &&
        this.form.fechaEntrega;

      if (!camposExtrasCompletos) return;

      // Si todo está completo, guardar
      const nuevo = {
        id: Date.now(),
        ...this.form
      };

      this.nuevosEquipos.push(nuevo);
      this.mostrarModal = false;
      this.resetFormulario();
      this.camposValidados = false;
    },
    cerrarModal() {
      this.mostrarModal = false
      this.resetFormulario()
      this.camposValidados = false
    },
    resetFormulario() {
      this.form = {
        tipo: '',
        marca: '',
        modelo: '',
        serie: '',
        estado: '',
        fechaIngreso: '',
        fechaEntrega: ''
      };
    }
  }
}
</script>
