<template>
  <div class="q-ma-md">
    <div class="row full-width">
      <div class="full-width" style="max-width: 350px">
        <q-select outlined class="full-width" v-model="capteurSelected"
          :options="channels" label="Capteur" option-value="value"
          option-label="name" emit-value map-options />
      </div>
      <div v-if="capteurSelected" class="q-ml-md" style="max-width: 300px">
        <q-input outlined v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale"
                transition-hide="scale">
                <q-date v-model="date">
                  <div class="row items-center justify-end">
                    <q-btn no-caps v-close-popup label="Ok" color="primary"
                      flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div>
      <div v-if="capteurSelected" style="max-width: 300px">
        <q-input v-model="description" placeholder="Description" outlined
          type="textarea" />
      </div>
      <div v-if="capteurSelected">
        <q-btn v-if="!isUpdate" class="q-mt-md" color="primary"
          label="Sauvegarder" @click="addNewMaintenance" :loading="isLoading" />
        <q-btn v-else class="q-mt-md" color="primary" label="Maitre à jours"
          @click="updateMaintenace" :loading="isLoading" />
      </div>
    </div>
    <div>
      <TableFt :columns="columns" :lists="maintenaces"
        @deleteItem="deleteMaintenace" @updateItem="handleUpdate"
        :loading="onLoding" :show="userInfos.role === 'admin'"
        :showView="false" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

const keyUser = "WR6WNJE3WW10ID6V";
import { supabase } from "src/boot/supabase";
import TableFt from "src/components/table.vue";

const columns = [
  { name: "cap_id", align: "left", label: "#IdCapteur", field: "capteur_id" },
  {
    name: "capteur_name",
    align: "left",
    label: "Nom Capteur",
    field: "capteur_name",
  },
  {
    name: "desc",
    align: "left",
    label: "Description Maintenace",
    field: "description",
  },
  { name: "loc", align: "left", label: "Emplacement", field: "localisation" },
  { name: "user", align: "left", label: "Technicien", field: "user" },
  {
    name: "date",
    align: "left",
    label: "Date de maintenace",
    field: "created",
  },
  { name: "action", align: "right", label: "Action", field: "" },
];

export default defineComponent({
  name: "maintenance-page",
  components: { TableFt },
  setup() {
    const session = supabase.auth.session();

    const capteurSelected = ref();
    const maintenanceId = ref();
    const channels = ref([]);
    const date = ref("");
    const description = ref("");
    const isLoading = ref(false);
    const onLoding = ref(false);
    const maintenaces = ref([]);
    const $q = useQuasar();
    const isUpdate = ref(false);

    const userInfos = computed(() => {
      if (session) {
        return {
          name: `${session.user.user_metadata.name}`,
          role: `${session.user.user_metadata.role}`,
        };
      }
      return undefined;
    });

    const findCapteurs = async () => {
      await api
        .get("/channels.json", {
          params: {
            api_key: keyUser,
          },
        })
        .then(function (response) {
          // handle success
          channels.value = response.data.map((item) => {
            return {
              value: item.id,
              description: item.description,
              name: item.name,
              localisation: `Latitude: ${item.latitude}, Logitude: ${item.longitude}`,
            };
          });
          console.log(channels.value);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    };

    const addNewMaintenance = async () => {
      if (capteurSelected.value) {
        isLoading.value = true;
        const selected = channels.value.find(
          (channel) => channel.value == capteurSelected.value
        );
        if (selected) {
          const { data, error } = await supabase.from("maintenance").insert([
            {
              capteur_name: selected.name,
              localisation: selected.localisation,
              capteur_id: selected.value,
              created: new Date(date.value),
              description: description.value,
              updated: new Date(date.value),
              user: userInfos.value.name,
            },
          ]);

          if (data) {
            $q.notify({
              type: "positive",
              position: "top",
              message: "Maitenace ajouter avec success",
            });
            findAllMaintenaces();
            reset();
          }
          if (error) {
            $q.notify({
              type: "negative",
              position: "top",
              message: "Une erreur est survenu, capteur non Enregistrer",
            });
            reset();
          }
        }
      }
    };

    const findAllMaintenaces = async () => {
      onLoding.value = true;
      let { data: maintenance, error } = await supabase
        .from("maintenance")
        .select("*").order('created', { ascending: false })

      if (maintenance) {
        maintenaces.value = maintenance;
        console.log("maintenances", maintenance);
        onLoding.value = false;
      }
      if (error) {
        console.log("error", error);
        onLoding.value = false;
      }
    };

    const reset = () => {
      capteurSelected.value = null;
      date.value = "";
      description.value = "";
      isLoading.value = false;
      isUpdate.value = false;
    };

    const handleUpdate = (item) => {
      isUpdate.value = true;
      maintenanceId.value = item.id;
      capteurSelected.value = item.capteur_id;
      date.value = item.created;
      description.value = item.description;
    };

    const deleteMaintenace = async (id) => {
      const { data, error } = await supabase
        .from("maintenance")
        .delete()
        .eq("id", id);

      if (data) {
        findAllMaintenaces();
        $q.notify({
          type: "positive",
          position: "top",
          message: "Maitenace supprimer avec success",
        });
      }
      if (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Une erreur est survenu, Maitenace non supprimer",
        });
      }
    };

    const updateMaintenace = async () => {
      if (isUpdate.value && maintenanceId.value) {
        isLoading.value = true;
        const { data, error } = await supabase
          .from("maintenance")
          .update({
            description: description.value,
            updated: new Date(date.value),
          })
          .eq("id", maintenanceId.value);
        if (data) {
          $q.notify({
            type: "positive",
            position: "top",
            message: "Maitenace modifier avec success",
          });
          findAllMaintenaces();
          reset();
        }
        if (error) {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Une erreur est survenu, capteur non modifier",
          });
          reset();
        }
      }
    };

    onMounted(() => {
      findCapteurs();
      findAllMaintenaces();
    });
    return {
      capteurSelected,
      channels,
      date,
      description,
      addNewMaintenance,
      isLoading,
      columns,
      maintenaces,
      onLoding,
      handleUpdate,
      deleteMaintenace,
      updateMaintenace,
      isUpdate,
      userInfos,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
