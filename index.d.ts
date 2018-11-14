declare module '@marp-team/marpit' {
  interface MarpitOptions {
    backgroundSyntax?: boolean
    container?: false | Element | Element[]
    filters?: boolean
    headingDivider?: false | MarpitHeadingDivider | MarpitHeadingDivider[]
    inlineStyle?: boolean
    looseYAML?: boolean
    markdown?: string | object | [string, object]
    printable?: boolean
    scopedStyle?: boolean
    slideContainer?: false | Element | Element[]
    inlineSVG?: boolean
  }

  type MarpitHeadingDivider = 1 | 2 | 3 | 4 | 5 | 6

  type MarpitRenderResult = {
    html: string
    css: string
    comments: string[][]
  }

  type ThemeSetPackOptions = {
    after?: string
    before?: string
    containers?: Element[]
    printable?: boolean
    inlineSVG?: boolean
  }

  export class Marpit {
    constructor(opts?: MarpitOptions)

    markdown: any
    themeSet: ThemeSet

    readonly options: MarpitOptions
    readonly markdownItPlugins: (md: any) => void

    protected lastComments?: MarpitRenderResult['comments']
    protected lastGlobalDirectives?: { [directive: string]: any }
    protected lastStyles?: string[]

    render(markdown: string): MarpitRenderResult

    protected applyMarkdownItPlugins(md: any): void
    protected renderMarkdown(markdown: string): string
    protected renderStyle(theme?: string): string
    protected themeSetPackOptions(): ThemeSetPackOptions
  }

  export class Element {
    constructor(tag: string, attributes?: {})

    [index: string]: any
    tag: string
  }

  export class Theme {
    protected constructor(name: string, css: string)

    static fromCSS(cssString: string): Theme

    css: string
    height: string
    importRules: {
      node: any
      value: string
    }[]
    meta: {
      theme: string
      [key: string]: string
    }
    name: string
    width: string

    readonly heightPixel?: number
    readonly widthPixel?: number
  }

  export class ThemeSet {
    constructor()

    default?: Theme

    readonly size: number
    private readonly themeMap: Map<string, Theme>

    add(css: string): Theme
    addTheme(theme: Theme): void
    clear(): void
    delete(name: string): boolean
    get(name: string, fallback?: boolean): Theme | undefined
    getThemeProp(theme: string | Theme, prop: keyof Theme): any
    has(name: string): boolean
    pack(name: string, opts: ThemeSetPackOptions): string
    themes(): IterableIterator<Theme>
  }
}
