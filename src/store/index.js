import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    equipos: [],
  },

  getters: {
    obtenerEquipos: (state) => state.equipos,
    obtenerEquipoPorId: (state) => (id) =>
      state.equipos.find((e) => e.id === id),
  },

  mutations: {
    SET_EQUIPOS(state, equipos) {
      state.equipos = equipos;
    },
    ADD_EQUIPO(state, equipo) {
      state.equipos.push(equipo);
    },
    UPDATE_EQUIPO(state, equipoActualizado) {
      const index = state.equipos.findIndex(
        (e) => e.id === equipoActualizado.id
      );
      if (index !== -1) {
        Vue.set(state.equipos, index, equipoActualizado);
      }
    },
    DELETE_EQUIPO(state, id) {
      state.equipos = state.equipos.filter((e) => e.id !== id);
    },
  },

  actions: {
    cargarEquipos({ commit }) {
      const equiposDummy = [
        {
          id: 1,
          marca: "GE",
          modelo: "X200",
          nro_serie: "ABC123",
          estado: "revision",
          tipo: "humano",
          fecha_ingreso: "2025-01-10",
          fecha_mantencion: "2025-03-01",
          fecha_entrega: "2025-04-01",
          detalle: "Chequeo general",
          otroDetalle: "Conector flojo",
          accesorios: "Cable de poder",
        },
        {
          id: 2,
          marca: "Philips",
          modelo: "UltraScan",
          nro_serie: "XYZ456",
          estado: "facturado",
          tipo: "veterinario",
          fecha_ingreso: "2025-04-01",
          fecha_mantencion: "2025-05-10",
          fecha_entrega: "2025-06-15",
          detalle: "Mantenimiento preventivo",
          otroDetalle: "",
          accesorios: "Transductor",
        },
      ];
      commit("SET_EQUIPOS", equiposDummy);
    },

    agregarEquipo({ commit }, equipo) {
      commit("ADD_EQUIPO", equipo);
    },

    actualizarEquipo({ commit }, equipo) {
      commit("UPDATE_EQUIPO", equipo);
    },

    eliminarEquipo({ commit }, id) {
      commit("DELETE_EQUIPO", id);
    },
  },
});
