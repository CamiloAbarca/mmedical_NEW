<template>
  <div id="app" class="d-flex flex-column vh-100">
    <router-view />
  </div>
</template>

<script>
// No se necesitan imports ni lógica de sidebar aquí
export default {
  name: 'App',
};
</script>

<style>
/* Estilos globales si los hay */
/* Asegúrate de que los estilos de navbar y sidebar no estén aquí si son específicos del layout */
</style>