import { Clerk } from '@clerk/clerk-js'

const pubKey = import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

const clerk = new Clerk(pubKey)
await clerk.load()

if (clerk.user) {
  document.getElementById('sign-out').addEventListener('click', async () => {
    await clerk.signOut()
    window.location.reload()
  })
}