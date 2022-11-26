<template>
  <div class="q-mt-md">
    <GoogleMap v-if="capteurs.length" :api-key="googleMapApiKey"
      style="width: 100%; height: 80vh" :center="center" :zoom="15">
      <GoogleMarker v-for="capteur in capteurs" :key="capteur.id" :options="{
        position: capteur.location, icon: {
          url: capteur.infosCapteur.field1 < 25 || capteur.infosCapteur.field1 > 27
            || capteur.infosCapteur.field2 < 6 || capteur.infosCapteur.field2 > 7
            || capteur.infosCapteur.field3 == 0 ?
            require('../assets/alert.png') :
            require('../assets/valve.png'),
          scaledSize: { width: 50, height: 50 },
        }
      }">
        <InfoWindow>
          <div style="min-width: 250px" id="contet">
            <div class="text-h5 text-bold">N°: #{{ capteur.id }}</div>
            <div id="bodyContent">
              <div class="row justify-between items-center q-mb-md">
                <div class="text-h6 text-bold">
                  {{ capteur.description }}</div>
                <div class="row justify-center">
                  <q-btn class="q-mb-sm" outline rounded
                    :color="capteur.infosCapteur.field3 == 1 ? 'green' : 'red'"
                    @click="updateStatus(capteur.infosCapteur.captKey, capteur.infosCapteur.field3)"
                    :loading="captSelected == capteur.infosCapteur.captKey && onUpdate">
                    <div class="row items-center ">
                      <div class="q-mr-sm">
                        <q-icon
                          :name="capteur.infosCapteur.field3 == 1 ? 'toggle_on' : 'toggle_off'"
                          :color="capteur.infosCapteur.field3 == 1 ? 'green' : 'red'"
                          size="2rem" />
                      </div>
                      <div class="text-subtitle1 text-bold"
                        :class="capteur.infosCapteur.field3 == 1 ? 'text-green' : 'text-red'">
                        {{ capteur.infosCapteur.field3 == 1 ? 'On' : 'Off' }}
                      </div>
                    </div>
                  </q-btn>
                </div>
              </div>
              <div class="row q-mb-md" v-if="capteur.infosCapteur">
                <div class="row q-mr-md items-center">
                  <div class="q-mr-sm">
                    <q-icon name="device_thermostat"
                      :color="capteur.infosCapteur.field1 < 25 || capteur.infosCapteur.field1 > 27 ? 'red' : 'warning'"
                      size="2rem" />
                  </div>
                  <div class="text-subtitle1 text-bold">
                    {{ capteur.infosCapteur.field1 }} °C
                  </div>
                </div>
                <div>
                  <div class="row items-center q-mr-md">
                    <div class="q-mr-sm">
                      <q-icon name="water"
                        :color="capteur.infosCapteur.field2 < 6 || capteur.infosCapteur.field2 > 7 ? 'red' : 'warning'"
                        size="2rem" />
                    </div>
                    <div class="text-subtitle1 text-bold">
                      {{ capteur.infosCapteur.field2 }} PH
                    </div>
                  </div>
                </div>
                <div>
                  <div class="row items-center ">
                    <div class="q-mr-sm">
                      <q-icon name="speed" color="warning" size="2rem" />
                    </div>
                    <div class="text-subtitle1 text-bold">
                      {{ capteur.infosCapteur.field4 }} L
                    </div>
                  </div>
                </div>
              </div>
              <div class="row justify-center">
                <q-btn color="primary" no-caps unelevated label="Plus d'infos"
                  @click="() => $router.push({
                    name: 'statistique',
                    params: {
                      id: capteur.id, title: capteur.description, key: capteur.infosCapteur.captKey
                    }
                  })" />
              </div>
            </div>
          </div>
        </InfoWindow>
      </GoogleMarker>
    </GoogleMap>
    <div v-else>
      <q-linear-progress stripe size="10px" indeterminate />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { GoogleMap, Marker as GoogleMarker, InfoWindow, CustomMarker } from 'vue3-google-map'
import { api } from 'src/boot/axios'
import valve from "src/assets/valve.png"

const keyUser = 'WR6WNJE3WW10ID6V'


export default defineComponent({
  components: { GoogleMap, GoogleMarker, InfoWindow },
  name: 'IndexPage',
  setup() {
    const center = reactive({ lat: -21.46, lng: 47.0934403 })
    const interval = ref()
    const radio = true
    const onUpdate = ref(true)
    const captSelected = ref()

    const capteurs = ref([])

    const googleMapApiKey = process.env.GOOGLE_MAP_API_KEY


    const findCapteurs = async () => {
      await api.get('/channels.json', {
        params: {
          api_key: keyUser
        }
      })
        .then(async function (response) {
          capteurs.value = await Promise.all(response.data.map(async (item) => {
            const captKey = item.api_keys[0].api_key
            let infosCapteur = {}
            let { data } = await api.get(`channels/${item.id}/feed.json`, {
              params: {
                key: captKey
              }
            })
            if (data) {
              infosCapteur = {
                id: item.id,
                name: item.name,
                description: item.description,
                location: {
                  lat: Number(item.latitude), lng: Number(item.longitude)
                },
                infosCapteur: { ...data.feeds[data.feeds.length - 1], captKey }
              }
              return infosCapteur
            }

          }))

        })
        .catch(function (error) {
          console.log(error);
        })
    }

    const randomNumber = (max, min) => {
      return Math.round(Math.random() * (max - min) + min)
    }

    const updateStatus = async (key, status) => {
      onUpdate.value = true
      captSelected.value = key
      await api.get('update', {
        params: {
          key: key,
          field3: status == 1 ? 0 : 1,
          field1: randomNumber(25, 45),
          field2: randomNumber(5, 7),
          field4: randomNumber(500, 600)
        }
      }).then(() => {
        onUpdate.value = false
        captSelected.value = undefined
      })
    }

    onMounted(() => {
      clearInterval(interval.value)
      interval.value = setInterval(() => {
        findCapteurs()
      }, 2000);
    })

    onUnmounted(() => {
      clearInterval(interval.value)
    })


    return { center, googleMapApiKey, capteurs, radio, onUpdate, captSelected, valve, updateStatus }
  }
})
</script>
