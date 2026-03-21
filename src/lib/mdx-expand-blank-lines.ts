/**
 * Markdown collapses runs of blank lines. Runs of 3+ newlines become
 * `<MdxBlank />` blocks so extra vertical space is preserved (outside fenced code).
 */
const FENCED_CODE = /(```[\s\S]*?```)/g

export function expandMultiBlankLines(source: string): string {
  const parts = source.split(FENCED_CODE)
  return parts
    .map((segment, index) => {
      if (index % 2 === 1) {
        return segment
      }
      return segment.replace(/\n{3,}/g, (run) => {
        const n = run.length
        const spacers = n - 2
        const blocks = Array.from({ length: spacers }, () => "<MdxBlank />").join(
          "\n\n"
        )
        return `\n\n${blocks}\n\n`
      })
    })
    .join("")
}
