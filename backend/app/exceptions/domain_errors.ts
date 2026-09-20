export class ResourceNotFoundError extends Error {
  status = 404

  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'ResourceNotFoundError'
  }
}

export class ForbiddenOwnershipError extends Error {
  status = 404

  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'ForbiddenOwnershipError'
  }
}
