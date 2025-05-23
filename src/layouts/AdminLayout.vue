<template>
  <div class="min-h-full">
    <Disclosure as="nav" class="border-b border-gray-200 bg-white" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <!-- Logo -->
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <img
                  class="block h-8 w-auto lg:hidden"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
              />
              <img
                  class="hidden h-8 w-auto lg:block"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
              />
            </div>
            <!-- Nav links -->
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a
                  v-for="item in navigation"
                  :key="item.name"
                  :href="item.href"
                  :class="[
                  item.current
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                ]"
                  :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </a>
            </div>
          </div>

          <!-- Profile + notifications -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button
                type="button"
                class="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true"/>
            </button>

            <Menu as="div" class="relative ml-3">
              <MenuButton
                  class="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="user.imageUrl" alt=""/>
              </MenuButton>

              <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <button
                        v-if="item.onClick"
                        @click="item.onClick()"
                        :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
                    >
                      {{ item.name }}
                    </button>
                    <a
                        v-else
                        :href="item.href"
                        :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                    >
                      {{ item.name }}
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <DisclosureButton
                class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="h-6 w-6" aria-hidden="true"/>
              <XMarkIcon v-else class="h-6 w-6" aria-hidden="true"/>
            </DisclosureButton>
          </div>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 pb-3 pt-2">
          <DisclosureButton
              v-for="item in navigation"
              :key="item.name"
              as="a"
              :href="item.href"
              :class="[
              item.current
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
              'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
            ]"
          >
            {{ item.name }}
          </DisclosureButton>
        </div>
        <div class="border-t border-gray-200 pb-3 pt-4">
          <div class="flex items-center px-4">
            <img class="h-10 w-10 rounded-full" :src="user.imageUrl" alt=""/>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <DisclosureButton
                v-for="item in userNavigation"
                :key="item.name"
                as="button"
                @click="item.onClick && item.onClick()"
                class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              {{ item.name }}
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <!-- PAGE HEADER -->
    <div class="py-10">
      <header class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
          <slot name="title"/>
        </h1>
      </header>

      <!-- PAGE CONTENT -->
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <slot/>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import {Bars3Icon, BellIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useRouter} from 'vue-router'
import axios from 'axios'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?' +
      'ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&' +
      'facepad=2&w=256&h=256&q=80',
}

// top-level nav
const navigation = [
  {name: 'Dashboard', href: '/dashboard', current: true},
]

// profile menu
const router = useRouter()

function logout() {
  localStorage.removeItem('auth_token')
  delete axios.defaults.headers.common['Authorization']
  router.push('/login')
}

const userNavigation = [
  {name: 'Sign out', onClick: logout},
]
</script>
