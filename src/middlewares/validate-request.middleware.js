export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParse(req.body)

      if (!result.success) {
        const formatted = result.error.format()
        const flatErrors = Object.values(formatted)
          .flat()
          .filter(Boolean)
          .map((err) => err._errors)
          .flat()
          .join(', ')

        return res.status(400).json({ message: flatErrors })
      }

      next()
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }
}
