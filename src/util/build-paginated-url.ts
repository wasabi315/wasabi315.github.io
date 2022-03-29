const buildPaginatedUrl = (path: string, page: number) => {
  if (page === 1) {
    return path
  }
  return `${path}/${page}`
}

export default buildPaginatedUrl
