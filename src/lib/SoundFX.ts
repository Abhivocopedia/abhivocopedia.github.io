type SoundType =
  | 'click'
  | 'flip'
  | 'scroll'
  | 'station'

class SoundFX {
  private enabled = false

  unlock() {
    // All generated UI sounds are intentionally disabled.
  }

  click() {
    // Disabled.
  }

  flip() {
    // Disabled.
  }

  scroll() {
    // Disabled.
  }

  station() {
    // Disabled.
  }

  startTrain() {
    // Disabled.
  }

  stopTrain() {
    // Disabled.
  }

  play(_type: SoundType) {
    // Disabled.
  }

  setEnabled(_value: boolean) {
    // Keep API compatibility, but never enable generated sounds.
    this.enabled = false
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundFX = new SoundFX()
