<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="bg-white text-dark">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="text-h6 text-weight-bolder">
            {{ $route.params.title || "Localisation" }}
          </div>
        </q-toolbar-title>

        <q-btn flat class="text-subtitle1 text-weight-bolder">
          <div class="row items-center">
            <q-avatar class="q-mr-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div v-if="user">
              {{ user.name }}
            </div>
          </div>
        </q-btn>
        <q-btn @click="logout" :loading="loading" flat
          class="text-subtitle1 text-weight-bolder">
          <q-icon name="logout" color="red" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above
      style="background: #e8f1f8">
      <q-list>
        <q-item-label header>
          <div class="row items-center">
            <q-img :src="logo" spinner-color="white" class="q-mr-sm"
              style="height: 50px; max-width: 50px" />
            <div class="text-primary text-subtitle1 text-weight-bolder">
              JIRO SY RANO MALAGASY
            </div>
          </div>
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title"
          v-bind="link" />
        <q-item clickable v-if="user && user.role === 'admin'"
          :class="route.name === 'capteur' ? 'hight' : ''" @click="
            $router.push({
              name: 'capteur',
              params: { title: 'Gestion des capteurs' },
            })
          ">
          <q-item-section avatar>
            <q-icon name="sensors" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div class="text-subtitle1 text-weight-medium">
                Gestion des capteurs
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="user && user.role === 'admin'"
          :class="route.name === 'user' ? 'hight' : ''" @click="
            $router.push({
              name: 'user',
              params: { title: 'Gestion des utilisateurs' },
            })
          ">
          <q-item-section avatar>
            <q-icon name="group_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div class="text-subtitle1 text-weight-medium">
                Gestion des utilisateurs
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-color text-black">
      <q-toolbar class="row justify-end" style="height: 110px">
        <div class="row">
          <!-- <div class="q-mr-md" style="font-size: 20px">© Sandra Rafidy2022</div> -->
          <q-img :src="logoFt" spinner-color="white" style="width: 100px" />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { supabase } from "src/boot/supabase";
import { useRouter, useRoute } from "vue-router";
import EssentialLink from "components/EssentialLink.vue";
import logo from "src/assets/logo.png";
import logoFt from "src/assets/futurella.png";

const linksList = [
  {
    title: "Localisation",
    icon: "location_on",
    link: "localization",
  },
  {
    title: "Maintenance",
    icon: "engineering",
    link: "maintenance",
  },
  {
    title: "Rapport",
    icon: "checklist",
    link: "rapport",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const session = supabase.auth.session();
    const leftDrawerOpen = ref(false);
    const loading = ref(false);

    const user = computed(() => {
      if (session) {
        return {
          name: `${session.user.user_metadata.name}`,
          role: `${session.user.user_metadata.role}`,
        };
      }
      return undefined;
    });

    const logout = async () => {
      loading.value = true;
      const { error } = await supabase.auth.signOut();
      if (!error) {
        loading.value = false;
        router.push({ name: "login" });
      }
      loading.value = false;
    };

    onMounted(async () => {
      if (!session) {
        router.push({ name: "login" });
      } else {
        router.push({
          name: "localization",
          params: {
            title: "Localisation",
          },
        });
      }
    });

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      logo,
      logoFt,
      loading,
      user,
      route,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
    };
  },
});
</script>
<style scoped>
.hight {
  background: rgba(92, 92, 92, 0.089);
}

.bg-color {
  background: transparent;
}
</style>
