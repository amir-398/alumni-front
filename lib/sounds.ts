export function playFaaaaSound() {
  if (typeof window === "undefined") return
  try {
    const audio = new Audio("/faaa-sound.mp3")
    audio.volume = 1
    audio.play().catch(() => {})
  } catch {}
}

export function playSiuuuSound() {
  if (typeof window === "undefined") return
  try {
    const audio = new Audio("/siuu-sound.mp3")
    audio.volume = 1
    audio.play().catch(() => {})
  } catch {}
}
