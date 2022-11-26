<template>
  <div class="q-pl-md">
    <form>
      <div class="row items-center">
        <div class="q-mr-md">
          <div class="text-subtitle1 text-primary">Nom et Prenom</div>
          <q-input dense outlined v-model="form.name" />
        </div>
        <div class="q-mr-md">
          <div class="text-subtitle1 text-primary">Adresse email</div>
          <q-input dense outlined v-model="form.email" />
        </div>
        <div class="q-mr-md">
          <div class="text-subtitle1 text-primary">Poste</div>
          <q-input dense outlined v-model="form.post" />
        </div>
        <div class="">
          <div class="text-subtitle1 text-primary">Rôle</div>
          <q-select dense outlined v-model="form.role" :options="options"
            label="Role" />
        </div>
      </div>
      <div class="q-mt-sm">
        <q-btn v-if="isUpdate" dense @click="resetInput" size="16px"
          type="submit" unelevated color="red-6" class="q-mr-md" no-caps
          label="Annuler" />
        <q-btn dense v-if="isUpdate" @click=" updateUser" size="16px"
          :loading="loading" type="submit" unelevated color="primary" class=""
          no-caps label="Metre à jour" />

        <q-btn v-else dense @click="submit" size="16px" :loading="loading"
          type="submit" unelevated color="primary" class="" no-caps
          label="Enregister" />
      </div>
    </form>
  </div>
  <div class="q-pa-md">
    <TableFt :columns="columns" :lists="users" @deleteItem="deleteUser"
      @updateItem="handleUpdate" :loading="isLoding" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { axios } from 'src/boot/axios';
import { useQuasar } from 'quasar'
import TableFt from 'src/components/table.vue';

const columns = [
  { name: 'fullName', align: 'left', label: 'Nom et Prenom', field: 'fullName' },
  { name: 'email', align: 'left', label: 'Email', field: 'email' },
  { name: 'post', align: 'left', label: 'Post', field: 'post' },
  { name: 'role', align: 'left', label: 'Rôle', field: 'role' },
  { name: 'action', align: 'right', label: 'Action', field: '' },

]

const url = 'http://localhost:4300'

export default defineComponent({
  name: 'login-page',
  components: { TableFt },
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const options = [
      'admin',
      'utilisateur'
    ]

    const form = reactive({
      email: '',
      name: '',
      post: '',
      role: 'utilisateur'
    })

    const userId = ref('')

    const isUpdate = ref(false)
    const isLoding = ref(false)

    const users = ref([])

    const submit = async () => {
      loading.value = true
      axios.post(`${url}/creat-user`, {
        role: form.role,
        post: form.post,
        name: form.name,
        email: form.email,
      })
        .then(() => {
          loading.value = false
          $q.notify({
            type: 'positive',
            position: "top",
            message: 'Utilisateur ajouter avec success'
          })
          resetInput()
          getUsers()

        })
        .catch(() => {
          loading.value = false
          $q.notify({
            type: 'negative',
            position: "top",
            message: 'Une erreur est survenu, utilisateur non enregister'
          })
          resetInput()
        })
    }

    const getUsers = async () => {
      isLoding.value = true
      axios.get(`${url}/users`)
        .then(({ data }) => {
          users.value = data.data
        })
        .catch((error) => {
          console.log(error);
        }).finally(() => {
          isLoding.value = false
        })
    }

    const deleteUser = (id) => {
      axios.post(`${url}/delete-user`, {
        userId: id
      })
        .then(({ data }) => {
          $q.notify({
            type: 'positive',
            position: "top",
            message: 'Utilisateur supprimer avec success'
          })
          getUsers()
        })
        .catch((error) => {
          console.log(error);
          $q.notify({
            type: 'negative',
            position: "top",
            message: 'Une erreur est survenu, utilisateur non supprimer'
          })
        })
    }

    const handleUpdate = (user) => {
      isUpdate.value = true
      form.email = user.email
      form.name = user.fullName
      form.post = user.post
      form.role = user.role
      userId.value = user.id
    }

    const updateUser = () => {
      loading.value = true
      axios.post(`${url}/update-user`, {
        role: form.role,
        post: form.post,
        name: form.name,
        email: form.email,
        userId: userId.value
      }).then(() => {
        loading.value = false
        isUpdate.value = false
        $q.notify({
          type: 'positive',
          position: "top",
          message: 'Utilisateur mis à jours avec success'
        })
        resetInput()
        getUsers()

      })
        .catch(() => {
          loading.value = false
          isUpdate.value = false
          $q.notify({
            type: 'negative',
            position: "top",
            message: 'Une erreur est survenu, utilisateur non mis à jours'
          })
          resetInput()
        })

    }



    const resetInput = () => {
      form.email = ''
      form.name = ''
      form.post = ''
      form.role = 'user'
      isUpdate.value = false
    }

    onMounted(() => {
      getUsers()
    })

    return { form, loading, options, columns, users, isUpdate, isLoding, submit, resetInput, updateUser, handleUpdate, deleteUser }
  }
})
</script>

<style lang="scss" scoped>

</style>
