import { clerkClient } from '@clerk/clerk-sdk-node'

export function showSignIn (req, res) {
  const signInUrl = process.env.CLERK_SIGN_IN_URL || '#'
  res.send(`
    <html>
      <body>
        <h1>Logga in</h1>
        <p><a href="${signInUrl}">Klicka här för att logga in via Clerk</a></p>
      </body>
    </html>
  `)
}

export function showSignUp (req, res) {
  const signUpUrl = process.env.CLERK_SIGN_UP_URL || '#'
  res.send(`
    <html>
      <body>
        <h1>Registrera dig</h1>
        <p><a href="${signUpUrl}">Klicka här för att skapa ett konto</a></p>
      </body>
    </html>
  `)
}

export function manageAccount (req, res) {
  const accountUrl = process.env.CLERK_MANAGE_ACCOUNT_URL || '#'
  res.redirect(accountUrl)
}

export function sayHello (req, res) {
  res.redirect('/')
}

export async function logout(req, res) {
    try {
      const sessionId = req.auth?.sessionId
      if (sessionId) {
        await clerkClient.sessions.revokeSession(sessionId)
      }
      res.clearCookie('__session', { path: '/' })
  
      return res.redirect('/') 
    }
    catch (error) {
      console.error('Error during logout', error)
      return res.redirect('/') 
    }
  }
  /*
async function logout (req, res) {
  try {
    const sessionId = req.auth && req.auth.sessionId
    if (!sessionId) {
      return res.redirect('/')
    }
    await clerkClient.sessions.revokeSession(sessionId)
    res.clearCookie('__session', { path: '/' })
    return res.redirect('/')
  }
  catch (error) {
    console.error('Error during logout', error)
    return res.redirect('/')
  }
}
  */
