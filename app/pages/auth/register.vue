<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

const { register, loading } = useAuth()
const error = ref('')

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  graduationYear: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  degree: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  linkedinUrl: '',
  graduationYear: undefined as number | undefined,
  degree: ''
})

const onSubmit = async (event: any) => {
  try {
    error.value = ''
    // Remove confirmPassword before sending to API if needed, or backend ignores it
    // The register function in useAuth expects RegisterCredentials which doesn't have confirmPassword
    const { confirmPassword, ...credentials } = state
    await register(credentials)
  } catch (err: any) {
    error.value = err.message || 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
      Create Account
    </h2>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="First Name" name="firstName">
          <UInput v-model="state.firstName" placeholder="John" />
        </UFormGroup>
        <UFormGroup label="Last Name" name="lastName">
          <UInput v-model="state.lastName" placeholder="Doe" />
        </UFormGroup>
      </div>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" autocomplete="email" placeholder="john.doe@example.com" />
      </UFormGroup>

      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" autocomplete="new-password" placeholder="••••••••" />
        </UFormGroup>
        <UFormGroup label="Confirm Password" name="confirmPassword">
          <UInput v-model="state.confirmPassword" type="password" autocomplete="new-password" placeholder="••••••••" />
        </UFormGroup>
      </div>

      <UFormGroup label="LinkedIn URL" name="linkedinUrl">
        <UInput v-model="state.linkedinUrl" type="url" placeholder="https://linkedin.com/in/johndoe" />
      </UFormGroup>

      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Graduation Year" name="graduationYear">
          <UInput v-model="state.graduationYear" type="number" placeholder="2023" />
        </UFormGroup>
        <UFormGroup label="Degree" name="degree">
          <UInput v-model="state.degree" placeholder="Master in Data Science" />
        </UFormGroup>
      </div>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <UButton type="submit" block :loading="loading">
        Register
      </UButton>
    </UForm>

    <div class="mt-6 text-center text-sm">
      <span class="text-gray-500 dark:text-gray-400">Already have an account?</span>
      <NuxtLink to="/auth/login" class="ml-1 font-medium text-primary-600 hover:text-primary-500">
        Sign in here
      </NuxtLink>
    </div>
  </div>
</template>
