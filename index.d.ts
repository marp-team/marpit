declare module '@marp-team/marpit' {
  interface MarpitOptions {
    container?: false | Element | Element[]
    headingDivider?: false | MarpitHeadingDivider | MarpitHeadingDivider[]
    looseYAML?: boolean
    markdown?: any
    printable?: boolean
    slideContainer?: false | Element | Element[]
    inlineSVG?: boolean
  }

  type MarpitHeadingDivider = 1 | 2 | 3 | 4 | 5 | 6

  type MarpitRenderResult<T = string> = {
    html: T
    css: string
    comments: string[][]
  }

  type MarpitDirectiveDefinitions = {
    [directive: string]: (
      value: string | object | (string | object)[],
      marpit?: Marpit
    ) => { [meta: string]: any }
  }

  type ThemeSetPackOptions = {
    after?: string
    before?: string
    containers?: Element[]
    printable?: boolean
    inlineSVG?: boolean
  }

  namespace MarpitEnv {
    export interface HTMLAsArray {
      htmlAsArray: true
      [key: string]: any
    }
  }

  export class Marpit {
    constructor(opts?: MarpitOptions)

    markdown: any
    themeSet: ThemeSet

    readonly customDirectives: {
      global: MarpitDirectiveDefinitions
      local: MarpitDirectiveDefinitions
    }
    readonly options: MarpitOptions

    /** @deprecated A plugin interface for markdown-it is deprecated and will remove in next major version. Instead, wrap markdown-it instance when creating Marpit by `new Marpit({ markdown: markdownItInstance })`. */
    readonly markdownItPlugins: (md: any) => void

    protected lastComments?: MarpitRenderResult['comments']
    protected lastGlobalDirectives?: { [directive: string]: any }
    protected lastSlideTokens?: any[]
    protected lastStyles?: string[]

    render(
      markdown: string,
      env: MarpitEnv.HTMLAsArray
    ): MarpitRenderResult<string[]>
    render(markdown: string, env?: any): MarpitRenderResult

    use<P extends any[]>(
      plugin: (
        this: Marpit['markdown'],
        md: Marpit['markdown'],
        ...params: P
      ) => void,
      ...params: P
    ): this

    protected applyMarkdownItPlugins(md: any): void
    protected renderMarkdown(markdown: string, env?: any): string
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
    getThemeProp(theme: string | Theme, propPath: string): any
    has(name: string): boolean
    pack(name: string, opts: ThemeSetPackOptions): string
    themes(): IterableIterator<Theme>
  }
}
