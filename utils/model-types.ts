export const modelTypes = [
  'Text', 'Image', 'Code', 'Video', 'Audio'
]

export function toggleType(type:string, types:string) {
  const typesArray = typeof types === 'string' ? types.split(',') : (types || ['text'])
  if (typesArray && typesArray.includes(type)) {
    return typesArray.filter(x => x !== type).join(',') || 'text'
  } else {
    return [...typesArray, type].filter(x => x !== '').join(',') || 'text'
  }
}

export function isActiveType(type:string, types:string) {
  const typesArray = typeof types === 'string' ? types.split(',') : (types || ['text'])
  return typesArray.includes(type)
}