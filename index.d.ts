declare namespace MarpitEnv {
  interface HTMLAsArray {
    htmlAsArray: true
    [key: string]: any
  }
}

declare namespace Marpit {
  interface Options {
    anchor?: boolean | AnchorCallback
    container?: false | Element | Element[]
    cssContainerQuery?: boolean | string | string[]
    cssNesting?: boolean
    headingDivider?: false | HeadingDivider | HeadingDivider[]
    lang?: string
    looseYAML?: boolean
    markdown?: any
    printable?: boolean
    slideContainer?: false | Element | Element[]
    inlineSVG?: boolean | InlineSVGOptions
  }

  type AnchorCallback = (index: number) => string

  type HeadingDivider = 1 | 2 | 3 | 4 | 5 | 6

  type InlineSVGOptions = {
    enabled?: boolean
    backdropSelector?: boolean
  }

  type RenderResult<T = string> = {
    html: T
    css: string
    comments: string[][]
  }

  type DirectiveDefinitions = {
    [directive: string]: (
      value: string | object | (string | object)[],
      marpit?: Marpit,
    ) => { [meta: string]: any }
  }

  type Plugin<P extends any[], T extends {} = {}> = (
    this: Marpit['markdown'] & T,
    md: Marpit['markdown'] & T,
    ...params: P
  ) => void

  type ThemeMetaType = {
    [key: string]: StringConstructor | ArrayConstructor
  }

  type ThemeReservedMeta = {
    theme: string
  }

  interface ThemeSetOptions {
    cssNesting?: boolean
  }

  type ThemeOptions = {
    cssNesting?: boolean
    metaType?: ThemeMetaType
  }

  type ThemeSetPackOptions = {
    after?: string
    before?: string
    containers?: Element[]
    printable?: boolean
    inlineSVG?: boolean
  }

  type PluginFactory = <P extends any[]>(
    plugin: Plugin<P, { marpit: Marpit }>,
  ) => Plugin<P, { marpit: Marpit }>

  export class Marpit {
    constructor(opts?: Options)

    markdown: any
    themeSet: ThemeSet

    readonly customDirectives: {
      global: DirectiveDefinitions
      local: DirectiveDefinitions
    }
    readonly options: Options

    protected lastComments: RenderResult['comments'] | undefined
    protected lastGlobalDirectives: { [directive: string]: any } | undefined
    protected lastSlideTokens: any[] | undefined
    protected lastStyles: string[] | undefined

    render(markdown: string, env: MarpitEnv.HTMLAsArray): RenderResult<string[]>
    render(markdown: string, env?: any): RenderResult

    use<P extends any[]>(plugin: Plugin<P>, ...params: P): this

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

    static fromCSS(cssString: string, opts?: ThemeOptions): Readonly<Theme>

    css: string
    height: string
    importRules: {
      node: any
      value: string
    }[]
    meta: Readonly<ThemeReservedMeta & Record<string, string | string[]>>
    name: string
    width: string

    readonly heightPixel: number | undefined
    readonly widthPixel: number | undefined
  }

  export class ThemeSet {
    constructor(opts?: ThemeSetOptions)

    cssNesting: boolean
    default: Theme | undefined
    metaType: ThemeMetaType

    readonly size: number
    private readonly themeMap: Map<string, Theme>

    add(css: string): Theme
    addTheme(theme: Theme): void
    clear(): void
    delete(name: string): boolean
    get(name: string, fallback?: boolean): Theme | undefined
    getThemeMeta(
      theme: string | Theme,
      meta: string,
    ): string | string[] | undefined
    getThemeProp(theme: string | Theme, prop: string): any
    has(name: string): boolean
    pack(name: string, opts: ThemeSetPackOptions): string
    themes(): IterableIterator<Theme>
  }
}

declare module '@marp-team/marpit' {
  export = Marpit
}

declare module '@marp-team/marpit/plugin' {
  export const marpitPlugin: Marpit.PluginFactory
  export default marpitPlugin
}
