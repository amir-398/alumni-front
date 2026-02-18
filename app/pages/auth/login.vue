<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

const { login, loading } = useAuth()
const error = ref('')

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const state = reactive({
  email: '',
  password: ''
})

const onSubmit = async () => {
  try {
    error.value = ''
    await login(state)
  } catch (err: any) {
    error.value = err.message || 'Invalid email or password'
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
      Sign In
    </h2>

    <div v-if="$route.query.registered" class="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
      Registration successful! Please wait for admin approval.
    </div>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" autocomplete="email" placeholder="you@example.com" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" autocomplete="current-password" placeholder="••••••••" />
      </UFormGroup>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <UButton type="submit" block :loading="loading">
        Sign In
      </UButton>
    </UForm>

    <div class="mt-6 text-center text-sm">
      <span class="text-gray-500 dark:text-gray-400">Don't have an account?</span>
      <NuxtLink to="/auth/register" class="ml-1 font-medium text-primary-600 hover:text-primary-500">
        Register here
      </NuxtLink>
    </div>
  </div>
</template>
