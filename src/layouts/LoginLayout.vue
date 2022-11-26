<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-white text-dark">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row no-wrap items-center">
            <q-img :src="logo" spinner-color="white" class="q-mr-sm"
              style="height: 50px; max-width: 50px" />
            <div class="text-primary text-subtitle1 text-weight-bolder">JIRO SY
              RANO
              MALAGASY</div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script >
import { defineComponent, onMounted } from 'vue'
import logo from "src/assets/logo.png"
import { supabase } from 'src/boot/supabase'
import { useRouter } from 'vue-router'


export default defineComponent({
  setup() {
    const router = useRouter()
    const session = supabase.auth.session()
    onMounted(() => {
      if (session) {
        router.push({
          name: "localization", params: {
            title: 'Localisation'
          }
        })
      }
    })
    return { logo }
  },
})
</script>

