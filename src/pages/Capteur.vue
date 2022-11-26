<template>
  <div>
    <form>
      <div class="q-pl-md">
        <div class="row items-center q-mr-sm">
          <div class="q-mr-md">
            <div class="text-subtitle1 text-primary">Name</div>
            <q-input dense outlined v-model="channel.name" />
          </div>
          <div class="q-mr-md">
            <div class="text-subtitle1 text-primary">description</div>
            <q-input dense outlined v-model="channel.description" />
          </div>
          <div class="q-mr-md">
            <div class="text-subtitle1 text-primary">Latitude </div>
            <q-input dense outlined v-model="channel.latitude" />
          </div>
          <div class="">
            <div class="text-subtitle1 text-primary">Longitude </div>
            <q-input dense outlined v-model="channel.longitude" />
          </div>
        </div>
        <div class="q-mt-sm">
          <q-btn v-if="isUpdate" dense size="md" @click="reset" type="submit"
            unelevated color="red-6" class="q-mr-md" no-caps label="Annuler" />
          <q-btn v-if="isUpdate" dense size="md" @click="updateCapteur"
            :loading="loading" type="submit" unelevated color="primary"
            class="" no-caps label="Metre à jour" />
          <q-btn v-else dense size="md" @click="creatCapteur"
            :loading="loading" type="submit" unelevated color="primary"
            class="" no-caps label="Enregister" />
        </div>
      </div>
    </form>
  </div>
  <div class="q-pa-md">
    <TableFt :columns="columns" :rows="channels" :showView="true"
      @deleteItem="deleteCapteur" @updateItem="handleUpdate"
      :loading="isLoding" />

  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import TableFt from 'src/components/table.vue';
import { api } from 'src/boot/axios'


const columns = [
  { name: 'name', align: 'left', label: 'Name', field: 'name' },
  { name: 'desc', align: 'left', label: 'Description', field: 'description' },
  { name: 'loc', align: 'left', label: 'Localization', field: 'localisation' },
  { name: 'api_key', align: 'left', label: 'Api key', field: 'api_key' },
  { name: 'action', align: 'right', label: 'Action', field: '' },

]

const keyUser = 'WR6WNJE3WW10ID6V'

export default {
  name: 'capteur-page',
  components: { TableFt },
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const isUpdate = ref(false)
    const channelId = ref(null)
    const isLoding = ref(false)

    const channels = ref([])
    const channel = reactive({
      name: null,
      description: null,
      longitude: null,
      latitude: null,
    })

    const numCapteur = ref()

    const listcCapteurs = ref([])

    const creatCapteur = async () => {
      loading.value = true
      if (channel.name) {
        api.post('/channels.json', {
          api_key: keyUser,
          name: channel.name,
          description: channel.description,
          longitude: Number(channel.longitude),
          latitude: Number(channel.latitude),

        })
          .then(function (response) {
            // handle success
            findCapteurs()
            $q.notify({
              type: 'positive',
              position: "top",
              message: 'Capteur ajouter avec success'
            })
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            $q.notify({
              type: 'negative',
              position: "top",
              message: 'Une erreur est survenu, capteur non Enregistrer'
            })

          })
          .finally(function () {
            // always executed
            loading.value = false
            reset()
          });
      } else {
        loading.value = false
        $q.notify({
          type: 'negative',
          position: "top",
          message: 'Tous les champs sont requise'
        })
      }

    }

    const findCapteurs = async () => {
      isLoding.value = true
      api.get('/channels.json', {
        params: {
          api_key: keyUser
        }
      })
        .then(function (response) {
          console.log("🚀 ~ file: Capteur.vue ~ line 133 ~ response", response)
          // handle success
          channels.value = response.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              localisation: `Latitude: ${item.latitude}, Logitude: ${item.longitude}`,
              longitude: item.longitude,
              latitude: item.latitude,
              api_key: item.api_keys[0].api_key
            }
          })
          console.log(channels.value);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
          isLoding.value = false
        });
    }

    const deleteCapteur = async (channelId) => {
      api.delete(`/channels/${channelId}.json`, { data: { api_key: keyUser } })
        .then(() => {
          // handle success
          findCapteurs()
          $q.notify({
            type: 'positive',
            position: "top",
            message: 'Capteur supprimer avec success'
          })
        })
        .catch((error) => {
          // handle error
          console.log(error);
          $q.notify({
            type: 'negative',
            position: "top",
            message: 'Une erreur est survenu, capteur non supprimer'
          })

        })
        .finally(() => {
          // always executed
          loading.value = false
          reset()
        });
    }

    const updateCapteur = async () => {
      loading.value = true
      if (channel.name) {
        api.put(`/channels/${channelId.value}.json`, {
          api_key: keyUser,
          name: channel.name,
          description: channel.description,
          longitude: Number(channel.longitude),
          latitude: Number(channel.latitude),

        })
          .then(() => {
            // handle success
            findCapteurs()
            $q.notify({
              type: 'positive',
              position: "top",
              message: 'Capteur Modifier avec success'
            })
          })
          .catch((error) => {
            // handle error
            console.log(error);
            $q.notify({
              type: 'negative',
              position: "top",
              message: 'Une erreur est survenu, capteur non modifier'
            })

          })
          .finally(() => {
            // always executed
            loading.value = false
            reset()
          });
      } else {
        loading.value = false
        $q.notify({
          type: 'negative',
          position: "top",
          message: 'Tous les champs sont requise'
        })
      }
    }

    const handleUpdate = (item) => {
      isUpdate.value = true
      channelId.value = item.id
      channel.name = item.name
      channel.description = item.description
      channel.longitude = item.longitude
      channel.latitude = item.latitude
    }

    const reset = () => {
      channel.name = null
      channelId.value = null
      channel.description = null
      channel.longitude = null
      channel.latitude = null
      isUpdate.value = false
    }

    onMounted(() => {
      findCapteurs()
    })

    return { loading, channel, channels, columns, listcCapteurs, numCapteur, isUpdate, isLoding, reset, deleteCapteur, creatCapteur, handleUpdate, updateCapteur }
  }
}
</script>

<style lang="scss" scoped>

</style>
