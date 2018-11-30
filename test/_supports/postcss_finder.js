export function find(from, cond) {
  let found
  return (
    from.some(rule => {
      for (const key of Object.keys(cond)) {
        if (rule[key] === undefined) return false
        if (typeof cond[key] === 'function') {
          if (!cond[key](rule[key])) return false
        } else if (rule[key] !== cond[key]) {
          return false
        }
      }
      found = rule
      return true
    }) && found
  )
}

export const findAtRule = (f, cond) => find(f, { type: 'atrule', ...cond })
export const findComment = (f, cond) => find(f, { type: 'comment', ...cond })
export const findDecl = (f, cond) => find(f, { type: 'decl', ...cond })
export const findRule = (f, cond) => find(f, { type: 'rule', ...cond })

export default find
