/**
 * @module
 */

export const MarpitSymbol = Symbol('Marpit')

function onInitializeStateCore(state) {
  state.md[MarpitSymbol] = true

  state.marpit = function marpit(value) {
    state.md[MarpitSymbol] = value
  }
}

function ruleWrapper(basePlugin) {
  return function wrappedRule(state, ...args) {
    if (!state.md[MarpitSymbol]) return false

    return basePlugin(state, ...args)
  }
}

/**
 * Enhance markdown-it plugin system to support Marpit.
 *
 * @alias module:helpers/plugin
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Function} callback Callback function. markdown-it rules extended
 *     within the callback will check the disabled state of Marpit.
 */
function useMarpitPlugin(md, callback) {
  if (!Object.prototype.hasOwnProperty.call(md, MarpitSymbol)) {
    md[MarpitSymbol] = true

    const { State } = md.core

    md.core.State = function StateCore(src, markdownIt, env) {
      const state = new State(src, markdownIt, env)

      onInitializeStateCore(state)
      return state
    }
  }

  const ruler = Object.getPrototypeOf(md.core.ruler)
  const { after, at, before, push } = ruler

  const resetRuler = () => {
    ruler.after = after
    ruler.at = at
    ruler.before = before
    ruler.push = push
  }

  try {
    ruler.after = function marpitAfter(afterName, ruleName, fn, options) {
      return after.call(this, afterName, ruleName, ruleWrapper(fn), options)
    }

    ruler.at = function marpitAt(name, fn, options) {
      return at.call(this, name, ruleWrapper(fn), options)
    }

    ruler.before = function marpitBefore(beforeName, ruleName, fn, options) {
      return before.call(this, beforeName, ruleName, ruleWrapper(fn), options)
    }

    ruler.push = function marpitPush(ruleName, fn, options) {
      return push.call(this, ruleName, ruleWrapper(fn), options)
    }

    callback()
  } catch (e) {
    resetRuler()
    throw e
  }

  resetRuler()
}

export default useMarpitPlugin
