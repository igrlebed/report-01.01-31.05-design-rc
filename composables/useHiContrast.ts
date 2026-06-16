export function useHiContrast() {
  const hiContrast = useState('deck-hi-contrast', () => false)

  function toggleHiContrast() {
    hiContrast.value = !hiContrast.value
  }

  return { hiContrast, toggleHiContrast }
}
