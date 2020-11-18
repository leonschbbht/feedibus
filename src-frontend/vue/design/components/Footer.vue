<template>
      <v-footer
      >
              <v-card
          flat
          tile
          width="100%"
          class="secondary text-center"
        >
          <v-divider></v-divider>
  
          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} — <strong>feedibus</strong>
          </v-card-text>
        </v-card>
      </v-footer>
</template>
<script>
export default {};
</script>