// src/lib/SoundFX.ts

type SoundType =
  | 'click'
  | 'flip'
  | 'scroll'
  | 'station'

class SoundFX {
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null

  private trainGain: GainNode | null = null
  private trainOscillator: OscillatorNode | null = null
  private trainFilter: BiquadFilterNode | null = null

  private enabled = true
  private lastScrollTime = 0
  private lastClickTime = 0

  /*
   * Unlock Web Audio after a user interaction.
   *
   * Browsers commonly suspend AudioContext until the
   * user interacts with the page.
   */
  unlock() {
    const context = this.getContext()

    if (
      context &&
      context.state === 'suspended'
    ) {
      void context.resume()
    }
  }

  private getContext() {
    if (!this.context) {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext
          }
        ).webkitAudioContext

      if (!AudioContextClass) {
        return null
      }

      this.context = new AudioContextClass()

      this.masterGain =
        this.context.createGain()

      this.masterGain.gain.value = 0.5

      this.masterGain.connect(
        this.context.destination,
      )
    }

    if (
      this.context.state === 'suspended'
    ) {
      void this.context.resume()
    }

    return this.context
  }

  private createOutput(
    volume: number,
  ) {
    const context =
      this.getContext()

    if (
      !context ||
      !this.masterGain ||
      !this.enabled
    ) {
      return null
    }

    const gain =
      context.createGain()

    gain.gain.value = volume

    gain.connect(
      this.masterGain,
    )

    return {
      context,
      gain,
    }
  }

  private tone(
    frequency: number,
    duration: number,
    volume: number,
    oscillatorType:
      | OscillatorType
      = 'sine',
  ) {
    const output =
      this.createOutput(
        volume,
      )

    if (!output) return

    const {
      context,
      gain,
    } = output

    const oscillator =
      context.createOscillator()

    oscillator.type =
      oscillatorType

    oscillator.frequency.setValueAtTime(
      frequency,
      context.currentTime,
    )

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime,
    )

    gain.gain.exponentialRampToValueAtTime(
      volume,
      context.currentTime +
        0.008,
    )

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime +
        duration,
    )

    oscillator.connect(
      gain,
    )

    oscillator.start()

    oscillator.stop(
      context.currentTime +
        duration +
        0.02,
    )
  }

  click() {
    const now =
      performance.now()

    if (
      now -
        this.lastClickTime <
      45
    ) {
      return
    }

    this.lastClickTime =
      now

    this.tone(
      1050,
      0.045,
      0.3,
      'square',
    )

    window.setTimeout(() => {
      this.tone(
        720,
        0.035,
        0.18,
        'square',
      )
    }, 18)
  }

  flip() {
    const output =
      this.createOutput(
        0.36,
      )

    if (!output) return

    const {
      context,
      gain,
    } = output

    const oscillator =
      context.createOscillator()

    const filter =
      context.createBiquadFilter()

    oscillator.type =
      'triangle'

    oscillator.frequency.setValueAtTime(
      330,
      context.currentTime,
    )

    oscillator.frequency.exponentialRampToValueAtTime(
      1250,
      context.currentTime +
        0.16,
    )

    filter.type =
      'highpass'

    filter.frequency.value =
      260

    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime,
    )

    gain.gain.exponentialRampToValueAtTime(
      0.34,
      context.currentTime +
        0.018,
    )

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime +
        0.19,
    )

    oscillator
      .connect(filter)
      .connect(gain)

    oscillator.start()

    oscillator.stop(
      context.currentTime +
        0.21,
    )
  }

  scroll() {
    const now =
      performance.now()

    if (
      now -
        this.lastScrollTime <
      95
    ) {
      return
    }

    this.lastScrollTime =
      now

    const output =
      this.createOutput(
        0.1,
      )

    if (!output) return

    const {
      context,
      gain,
    } = output

    const bufferSize =
      Math.floor(
        context.sampleRate *
          0.055,
      )

    const buffer =
      context.createBuffer(
        1,
        bufferSize,
        context.sampleRate,
      )

    const data =
      buffer.getChannelData(0)

    for (
      let index = 0;
      index < bufferSize;
      index += 1
    ) {
      data[index] =
        (
          Math.random() * 2 -
          1
        ) *
        (
          1 -
          index / bufferSize
        )
    }

    const source =
      context.createBufferSource()

    const filter =
      context.createBiquadFilter()

    filter.type =
      'bandpass'

    filter.frequency.value =
      1650

    filter.Q.value =
      0.8

    source
      .connect(filter)
      .connect(gain)

    source.start()

    source.stop(
      context.currentTime +
        0.055,
    )
  }

  startTrain() {
    if (
      this.trainOscillator
    ) {
      return
    }

    const context =
      this.getContext()

    if (
      !context ||
      !this.masterGain ||
      !this.enabled
    ) {
      return
    }

    this.trainGain =
      context.createGain()

    this.trainFilter =
      context.createBiquadFilter()

    this.trainOscillator =
      context.createOscillator()

    this.trainOscillator.type =
      'sawtooth'

    this.trainOscillator.frequency.value =
      68

    this.trainFilter.type =
      'lowpass'

    this.trainFilter.frequency.value =
      340

    this.trainGain.gain.value =
      0.0001

    this.trainOscillator
      .connect(
        this.trainFilter,
      )
      .connect(
        this.trainGain,
      )
      .connect(
        this.masterGain,
      )

    this.trainOscillator.start()

    this.trainGain.gain.exponentialRampToValueAtTime(
      0.18,
      context.currentTime +
        0.35,
    )
  }

  stopTrain() {
    const context =
      this.context

    const oscillator =
      this.trainOscillator

    const gain =
      this.trainGain

    if (
      !context ||
      !oscillator ||
      !gain
    ) {
      return
    }

    gain.gain.cancelScheduledValues(
      context.currentTime,
    )

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime +
        0.25,
    )

    oscillator.stop(
      context.currentTime +
        0.3,
    )

    this.trainOscillator =
      null

    this.trainGain =
      null

    this.trainFilter =
      null
  }

  station() {
    this.tone(
      880,
      0.12,
      0.22,
      'sine',
    )

    window.setTimeout(() => {
      this.tone(
        1320,
        0.18,
        0.18,
        'sine',
      )
    }, 110)
  }

  play(
    type: SoundType,
  ) {
    switch (type) {
      case 'click':
        this.click()
        break

      case 'flip':
        this.flip()
        break

      case 'scroll':
        this.scroll()
        break

      case 'station':
        this.station()
        break
    }
  }

  setEnabled(
    value: boolean,
  ) {
    this.enabled = value

    if (!value) {
      this.stopTrain()
    }
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundFX =
  new SoundFX()

