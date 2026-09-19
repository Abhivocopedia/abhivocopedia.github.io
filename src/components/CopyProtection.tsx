import { useEffect } from 'react'

export function CopyProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.code-block')) {
        e.preventDefault()
        showCopyNotice()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const restrictedKeys = ['c', 'x', 'v', 'p', 's']
      if (
        (e.ctrlKey || e.metaKey) &&
        restrictedKeys.includes(e.key.toLowerCase())
      ) {
        const target = e.target as HTMLElement
        if (!target.closest('.code-block')) {
          e.preventDefault()
          showCopyNotice()
        }
      }
    }

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.code-block')) {
        e.preventDefault()
        showCopyNotice()
      }
    }

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.closest('.code-block')) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('selectstart', handleSelectStart)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [])

  return null
}

function showCopyNotice() {
  const notice = document.getElementById('copyNotice')
  if (notice) {
    notice.style.display = 'block'
    setTimeout(() => {
      notice.style.display = 'none'
    }, 2000)
  }
}