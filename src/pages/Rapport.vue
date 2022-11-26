<template>
  <div class="q-ma-md">
    <div class="text-h6 text-bold">Filtre</div>
    <div class="row full-width items-center q-mb-md">
      <div class="full-width" style="max-width: 250px">
        <div class="q-mr-md">
          <div class="text-subtitle1 text-primary">
            Nom de technicien
          </div>
          <q-input dense outlined placeholder="Nom du Thechnicien"
            v-model="filterByName" />
        </div>
      </div>
      <div class="full-width" style="max-width: 250px">
        <div class="q-mr-md">
          <div class="text-subtitle1 text-primary">
            Nom Capteur
          </div>
          <q-input dense outlined placeholder="Nom du Capteur"
            v-model="filterByNameCapteur" />
        </div>
      </div>

      <div>
        <div class="text-subtitle1 text-primary">
          Date
        </div>
        <div class="row">
          <div class="q-mr-md">
            <q-btn icon="event" unelevated color="primary">
              <q-popup-proxy cover transition-show="scale"
                transition-hide="scale">
                <q-date v-model="fromCalendar" range mask="YYYY-MM-DD">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Annuler" no-caps color="primary" flat
                      v-close-popup />
                    <q-btn label="OK" no-caps color="primary" flat @click="save"
                      v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div class="text-subtitle1 text-bold"
            v-if="fromCalendar && fromCalendar.from">
            <q-btn @click="() => fromCalendar = undefined" unelevated outline
              no-caps color="white" icon-right="clear" text-color="primary">
              <div class="q-mr-sm"> Du {{ fromCalendar.from }} au
                {{ fromCalendar.to }}</div>
            </q-btn>
          </div>
        </div>
      </div>

      <q-space />

      <div>
        <q-btn unelevated outline icon-right="print" no-caps label="Imprimer"
          :loading="onPrint" class="q-mt-lg" color="primary"
          @click="generatePDF" />
      </div>

    </div>
    <div>
      <TableFt :columns="columns" :lists="maintenaces" :loading="onLoding"
        :show="userInfos.role === 'admin'" :showView="false" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed, watch } from "vue";

import { supabase } from "src/boot/supabase";
import TableFt from "src/components/table.vue";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const columns = [
  { name: "cap_id", align: "left", label: "#IdCapteur", field: "capteur_id" },
  { name: "user", align: "center", label: "Technicien", field: "user" },
  {
    name: "capteur_name",
    align: "left",
    label: "Nom Capteur",
    field: "capteur_name",
  },
  {
    name: "desc",
    align: "left",
    label: "Description Maintenance",
    field: "description",
  },
  { name: "loc", align: "left", label: "Emplacement", field: "localisation" },
  {
    name: "date",
    align: "right",
    label: "Date de maintenance",
    field: "created",
  },
];

export default defineComponent({
  name: "maintenance-page",
  components: { TableFt },
  setup() {
    const session = supabase.auth.session();

    const capteurSelected = ref();
    const channels = ref([]);
    const date = ref()
    const fromCalendar = ref()
    const filterByName = ref();
    const filterByNameCapteur = ref();
    const isLoading = ref(false);
    const onLoding = ref(false);
    const maintenaces = ref([]);
    const onPrint = ref(false)

    const userInfos = computed(() => {
      if (session) {
        return {
          name: `${session.user.user_metadata.name}`,
          role: `${session.user.user_metadata.role}`,
        };
      }
      return undefined;
    });

    watch(filterByName, (value) => {
      if (value) {
        findAllMaintenaces()
      } else {
        findAllMaintenaces()
      }
    })
    watch(filterByNameCapteur, (value) => {
      if (value) {
        findAllMaintenaces()
      } else {
        findAllMaintenaces()
      }
    })

    watch(fromCalendar, (value) => {
      date.value = value
    })

    watch(date, (value) => {
      if (value) {
        findAllMaintenaces()
      } else {
        findAllMaintenaces()
      }
    })

    const findAllMaintenaces = async () => {
      onLoding.value = true;
      let query = supabase
        .from("maintenance")
        .select("*").order('created', { ascending: false })

      if (filterByName.value) { query = query.ilike('user', `%${filterByName.value}%`) }
      if (filterByNameCapteur.value) { query = query.ilike('capteur_name', `%${filterByNameCapteur.value}%`) }
      if (date.value) {
        query = query.gt('created', date.value.from).lt('created', date.value.to)
      }
      let { data: maintenance, error } = await query
      if (maintenance) {
        maintenaces.value = maintenance;
        onLoding.value = false;
      }
      if (error) {
        console.log("error", error);
        onLoding.value = false;
      }
    };

    const generatePDF = () => {
      onPrint.value = true
      const doc = new jsPDF()
      doc.text("Rapport", 14, 10);
      autoTable(doc, { html: '.q-table' })
      doc.save(`rapport-${new Date()}.pdf`)
      onPrint.value = false
    };

    onMounted(() => {
      findAllMaintenaces();
    });
    return {
      capteurSelected,
      filterByName,
      channels,
      isLoading,
      columns,
      maintenaces,
      onLoding,
      userInfos,
      date,
      fromCalendar,
      filterByNameCapteur,
      onPrint,
      generatePDF
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
