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
        // Usa Vue.set para asegurar la reactividad
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
          tipo: "Humano",
          marca: "GE",
          modelo: "X200",
          serie: "ABC123",
          estado: "En Revisión",
          fechaIngreso: "2025-01-10",
          fechaEntrega: "2025-04-01",
          fechaPeriodo: "2025-04-01",
          accesorios: "Cable de poder",
          detalles: "Chequeo general",
        },
        {
          id: 2,
          tipo: "Veterinario",
          marca: "Philips",
          modelo: "UltraScan",
          serie: "XYZ456",
          estado: "Facturado",
          fechaIngreso: "2025-04-01",
          fechaEntrega: "2025-06-15",
          fechaPeriodo: "2025-04-01",
          accesorios: "Transductor",
          detalles: "Mantenimiento preventivo",
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
