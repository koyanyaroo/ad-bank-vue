<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="submit">
        <!-- Error message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
        </div>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="form.email" type="email" name="email" id="email" autocomplete="email" required
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input v-model="form.password" type="password" name="password" id="password" autocomplete="current-password"
                   required=""
                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {{ loading ? 'Logging in…' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import {reactive, ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'

const router = useRouter()
const form = reactive({email: '', password: ''})
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    // hits POST /auth/login on your API
    const response = await axios.post('/auth/login', {
      email: form.email,
      password: form.password
    })
    // extract token from response.data.data.token
    const token = response.data.data.token
    // persist & apply globally
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    // redirect
    router.push('/dashboard')
  } catch (e) {
    // Laravel returns 401 with no JSON schema, so guard against missing data
    error.value = e.response?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>