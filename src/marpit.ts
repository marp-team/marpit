import MarkdownIt from 'markdown-it'

type HeadingDividerLevel = 1 | 2 | 3 | 4 | 5 | 6

type MarkdownItConstructorParams =
  | MarkdownIt.PresetName
  | MarkdownIt.Options
  | [MarkdownIt.PresetName, MarkdownIt.Options?]
  | [MarkdownIt.Options?]

interface MarpitExtendedMarkdownIt extends MarkdownIt {
  marpit?: Marpit
}

type MarpitExtendedMarkdownItInternal = MarpitExtendedMarkdownIt & {
  __marpitExtended?: Record<string, boolean>
}

export interface MarpitOptions {
  headingDivider: false | HeadingDividerLevel | HeadingDividerLevel[]
  looseYAML: boolean
  markdown: MarkdownIt | MarkdownItConstructorParams
}

const isMarkdownItInstance = (md: unknown): md is MarkdownIt =>
  !!(
    typeof md === 'object' &&
    md &&
    'parse' in md &&
    typeof (md as any).parse === 'function' &&
    'renderer' in md &&
    typeof (md as any).renderer === 'object'
  )

export class Marpit {
  readonly options!: Readonly<MarpitOptions>

  #markdownIt!: MarpitExtendedMarkdownIt

  constructor(options: Partial<MarpitOptions> = {}) {
    Object.defineProperty(this, 'options', {
      enumerable: true,
      value: Object.freeze({
        headingDivider: options.headingDivider ?? false,
        looseYAML: options.looseYAML ?? false,
        markdown: options.markdown ?? 'commonmark',
      }),
    })

    this.setInitialMarkdownIt()
  }

  get markdown(): MarkdownIt {
    return this.#markdownIt
  }

  set markdown(markdownIt: MarkdownIt) {
    if (this.#markdownIt?.marpit) delete this.#markdownIt.marpit
    this.#markdownIt = markdownIt

    Object.defineProperty(markdownIt, 'marpit', {
      configurable: true,
      value: this,
    })

    this.applyMarpitBasePlugins()
  }

  // --------- protected methods (Often used in extended engines) ----------

  protected markAsMarpitExtended(key: string) {
    const md: MarpitExtendedMarkdownItInternal = this.markdown

    if (md) {
      const marpitExtended = md.__marpitExtended || {}

      Object.defineProperty(md, '__marpitExtended', {
        configurable: true,
        value: { ...marpitExtended, [key]: true },
      })
    }
  }

  protected isMarpitExtended(key: string) {
    const md: MarpitExtendedMarkdownItInternal = this.markdown
    return !!md?.__marpitExtended?.[key]
  }

  // --------- private methods ----------

  private setInitialMarkdownIt() {
    const { markdown } = this.options

    if (isMarkdownItInstance(markdown)) {
      this.markdown = markdown
    } else {
      const params = ([] as any[]).concat(markdown) as ConstructorParameters<
        typeof MarkdownIt
      >
      this.markdown = new MarkdownIt(...params)
    }
  }

  private applyMarpitBasePlugins() {
    if (this.isMarpitExtended('v3Base')) return

    // TODO: Apply base plugins

    this.markAsMarpitExtended('v3Base')
  }
}
