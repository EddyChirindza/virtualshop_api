// ─────────────────────────────────────────────
// VirtualShop API — Validação de input (auth)
// ─────────────────────────────────────────────
const { z } = require('zod');

const registerSchema = z.object({
  full_name: z.string().trim().min(3, 'Nome demasiado curto.').max(150),
  phone: z.string().trim().regex(/^\+?[0-9]{9,15}$/, 'Telemóvel inválido.'),
  email: z.string().trim().toLowerCase().email('Email inválido.'),
  password: z
    .string()
    .min(8, 'A password deve ter pelo menos 8 caracteres.')
    .regex(/[A-Z]/, 'A password deve ter pelo menos uma letra maiúscula.')
    .regex(/[a-z]/, 'A password deve ter pelo menos uma letra minúscula.')
    .regex(/[0-9]/, 'A password deve ter pelo menos um número.'),
});

const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Indica o email ou telemóvel.'),
  password: z.string().min(1, 'Password obrigatória.'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token inválido.'),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
