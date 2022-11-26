<template>
  <q-page class="row justify-center items-center">
    <q-card class="my-card q-pa-lg" style="">
      <q-card-section>
        <div
          class="row justify-center q-mb-md text-h5 text-weight-medium text-primary">
          CONNEXION
        </div>
        <form @submit="submit">
          <div class="q-mb-md">
            <div class="text-h6 text-primary">Adresse email</div>
            <q-input dense outlined v-model="form.email" />
          </div>
          <div>
            <div class="text-h6 text-primary">Mot de passe</div>
            <q-input dense outlined type="password" v-model="form.password" />
          </div>
          <div class="row q-mt-md justify-center">
            <q-btn size="lg" dense :loading="loading" type="submit" no-caps
              unelevated color="primary" class="" label="Se connecter" />
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'login-page',
  setup() {
    const router = useRouter()
    const loading = ref(false)

    const form = reactive({
      email: '',
      password: ''
    })

    const submit = async () => {
      loading.value = true
      const { user, error } = await supabase.auth.signIn({
        email: form.email,
        password: form.password
      })
      if (user) {
        loading.value = false
        router.push({
          name: "localization", params: {
            title: 'Localisation'
          }
        })
      }
      if (error) {
        console.log('error', error);
        loading.value = false
      }

    }

    return { form, loading, submit }
  }
})
</script>

<style  scoped>
.my-card {
  width: 100%;
  max-width: 550px;
  border-radius: 20px;
}
</style>
