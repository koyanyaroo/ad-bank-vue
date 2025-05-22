<template>
  <Notification
      :show="showNotification"
      :message="notificationMessage"
      @close="showNotification = false"
  />
  <router-view />
</template>

<script setup>
import Notification from "./components/Notification.vue";
import {ref} from 'vue'
const notifications = ref([])

function pushNotification({ type, text }) {
  notifications.value.push({
    id: Date.now(),
    type,
    text
  })
  // optionally auto-dismiss after a few seconds…
}
</script>
