<template>
  <AdminLayout>
    <Heading
        :name="user.name"
        :reload-key="reloadKey"
        @reload="bumpReload"
        @push-notification="pushNotification"
    />
    <TransactionTable
        :reload-key="reloadKey"
        @reload="bumpReload"
        @push-notification="pushNotification"
    />
    <Notification
        :show="showNotification"
        :message="notificationMessage"
        :notificationType="notificationType"
        @close="showNotification = false"
    />
  </AdminLayout>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import AdminLayout from "../layouts/AdminLayout.vue";
import TransactionTable from "../components/TransactionTable.vue";
import Heading from "../components/Heading.vue";
import Notification from "../components/Notification.vue";

const reloadKey = ref(0)
function bumpReload() {
  reloadKey.value++      // each child sees a new value
}
function pushNotification(notifType, message) {
  showNotification.value = true
  notificationMessage.value = message
  notificationType.value = notifType
}
// replace with your real user-fetch logic
const user = ref({name: ''})

// notification state
const showNotification      = ref(false)
const notificationMessage   = ref('')
const notificationType     = ref('success')

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem('user'))
})
</script>
