import { NextResponse } from "next/server"
import { exec } from "child_process"
import path from "path"

export const maxDuration = 300

export async function POST() {
  const scriptPath = path.resolve(
    process.cwd(),
    "..",
    "Alumni-backend",
    "backend",
    "linkedin_auth_local.py"
  )

  return new Promise<NextResponse>((resolve) => {
    const child = exec(
      `python3 "${scriptPath}"`,
      { timeout: 300_000 },
      (error, stdout, stderr) => {
        const output = stdout.trim()
        if (error || output !== "OK") {
          console.error("LinkedIn auth failed:", stderr, error?.message)
          resolve(
            NextResponse.json(
              { status: "error", message: "Authentification echouee. Verifiez le navigateur." },
              { status: 500 }
            )
          )
        } else {
          resolve(NextResponse.json({ status: "ok", message: "Authentification reussie" }))
        }
      }
    )

    child.stdout?.on("data", (data) => console.log("[linkedin-auth]", data))
    child.stderr?.on("data", (data) => console.error("[linkedin-auth]", data))
  })
}
