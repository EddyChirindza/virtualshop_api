const { z } = require('zod');

const optionalNumber = (schema) => z.preprocess(
  (value) => typeof value === 'string' && value.trim() !== '' ? Number(value) : value,
  schema
);

const optionalCategoryId = optionalNumber(
  z.number({ invalid_type_error: 'category deve ser um número.' })
    .int('category deve ser um inteiro.')
    .positive('category deve ser maior que zero.')
).optional();

const optionalPrice = (field) => optionalNumber(
  z.number({ invalid_type_error: `${field} deve ser um número.` })
    .nonnegative(`${field} não pode ser negativo.`)
).optional();

const optionalPage = optionalNumber(
  z.number({ invalid_type_error: 'page deve ser um número.' })
    .int('page deve ser um inteiro.')
    .positive('page deve ser maior que zero.')
).optional();

const optionalLimit = (field) => optionalNumber(
  z.number({ invalid_type_error: `${field} deve ser um número.` })
    .int(`${field} deve ser um inteiro.`)
    .min(1, `${field} deve ser pelo menos 1.`)
    .max(50, `${field} não pode ser superior a 50.`)
).optional();

const productListSchema = z.object({
  q: z.preprocess(
    (value) => typeof value === 'string' ? value.trim() : value,
    z.string().max(100, 'q não pode ter mais de 100 caracteres.').optional()
  ),
  category: optionalCategoryId,
  category_id: optionalCategoryId,
  minPrice: optionalPrice('minPrice'),
  maxPrice: optionalPrice('maxPrice'),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest'], {
    errorMap: () => ({ message: 'sort deve ser relevance, price_asc, price_desc ou newest.' }),
  }).optional(),
  page: optionalPage,
  limit: optionalLimit('limit'),
  page_size: optionalLimit('page_size'),
}).superRefine((params, context) => {
  if (params.minPrice !== undefined && params.maxPrice !== undefined && params.minPrice > params.maxPrice) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['minPrice'],
      message: 'minPrice não pode ser superior a maxPrice.',
    });
  }
});

module.exports = { productListSchema };