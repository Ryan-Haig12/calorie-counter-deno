const validUUID: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const validEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const alphanumberical: RegExp = /^[a-zA-Z0-9_ -.@]*$/
const twoDashesInRow: RegExp = /^(-\1{2})/
const validDate: RegExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

export { validUUID, validEmail, alphanumberical, twoDashesInRow, validDate }