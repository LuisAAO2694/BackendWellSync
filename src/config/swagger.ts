import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WellSync API',
            version: '1.0.0',
            description:
                'API REST para la aplicación WellSync — monitoreo de hábitos, entrenamientos y bienestar personal',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', description: 'ID del usuario' },
                        nombre: { type: 'string', description: 'Nombre del usuario' },
                        email: { type: 'string', format: 'email', description: 'Correo electrónico' },
                        fotoPerfil: { type: 'string', description: 'URL de la foto de perfil' },
                        rol: { type: 'string', enum: ['usuario', 'administrador'] },
                        fechaRegistro: { type: 'string', format: 'date-time' },
                    },
                },
                CreateUsuarioInput: {
                    type: 'object',
                    required: ['nombre', 'email', 'password'],
                    properties: {
                        nombre: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                    },
                },
                UpdateUsuarioInput: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                        rol: { type: 'string', enum: ['usuario', 'administrador'] },
                    },
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'JWT token' },
                    },
                },
                Habito: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        usuario: { type: 'string', description: 'ID del usuario propietario' },
                        nombre: { type: 'string' },
                        categoria: { type: 'string' },
                        metaDiaria: { type: 'string' },
                        horarioRecordatorio: { type: 'string' },
                        activo: { type: 'boolean' },
                        fechaCreacion: { type: 'string', format: 'date-time' },
                    },
                },
                CreateHabitoInput: {
                    type: 'object',
                    required: ['nombre', 'categoria', 'metaDiaria'],
                    properties: {
                        nombre: { type: 'string' },
                        categoria: { type: 'string' },
                        metaDiaria: { type: 'string' },
                        horarioRecordatorio: { type: 'string' },
                        activo: { type: 'boolean' },
                    },
                },
                UpdateHabitoInput: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string' },
                        categoria: { type: 'string' },
                        metaDiaria: { type: 'string' },
                        horarioRecordatorio: { type: 'string' },
                        activo: { type: 'boolean' },
                    },
                },
                Ejercicio: {
                    type: 'object',
                    properties: {
                        exerciseId: { type: 'string' },
                        nombre: { type: 'string' },
                        series: { type: 'integer', minimum: 1 },
                        repeticiones: { type: 'integer', minimum: 1 },
                        peso: { type: 'number', minimum: 0 },
                        completado: { type: 'boolean' },
                        notaPersonal: { type: 'string' },
                    },
                },
                Entrenamiento: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        usuario: { type: 'string', description: 'ID del usuario propietario' },
                        fecha: { type: 'string', format: 'date' },
                        hora: { type: 'string' },
                        estado: { type: 'string', enum: ['pendiente', 'completado'] },
                        notasGenerales: { type: 'string' },
                        ejercicios: { type: 'array', items: { $ref: '#/components/schemas/Ejercicio' } },
                    },
                },
                CreateEntrenamientoInput: {
                    type: 'object',
                    required: ['fecha', 'hora'],
                    properties: {
                        fecha: { type: 'string', format: 'date' },
                        hora: { type: 'string' },
                        estado: { type: 'string', enum: ['pendiente', 'completado'] },
                        notasGenerales: { type: 'string' },
                        ejercicios: { type: 'array', items: { $ref: '#/components/schemas/Ejercicio' } },
                    },
                },
                UpdateEntrenamientoInput: {
                    type: 'object',
                    properties: {
                        fecha: { type: 'string', format: 'date' },
                        hora: { type: 'string' },
                        estado: { type: 'string', enum: ['pendiente', 'completado'] },
                        notasGenerales: { type: 'string' },
                        ejercicios: { type: 'array', items: { $ref: '#/components/schemas/Ejercicio' } },
                    },
                },
                Logro: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        usuario: { type: 'string', description: 'ID del usuario' },
                        tipo: { type: 'string' },
                        habitoRelacionado: { type: 'string', description: 'ID del hábito relacionado' },
                        fechaObtenido: { type: 'string', format: 'date-time' },
                    },
                },
                CreateLogroInput: {
                    type: 'object',
                    required: ['tipo'],
                    properties: {
                        tipo: { type: 'string' },
                        habitoRelacionado: { type: 'string' },
                    },
                },
                UpdateLogroInput: {
                    type: 'object',
                    properties: {
                        tipo: { type: 'string' },
                        habitoRelacionado: { type: 'string' },
                    },
                },
                Reporte: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        usuario: { type: 'string', description: 'ID del usuario' },
                        tipo: { type: 'string' },
                        descripcion: { type: 'string' },
                        estado: { type: 'string', enum: ['abierto', 'en_proceso', 'resuelto'] },
                        fechaCreacion: { type: 'string', format: 'date-time' },
                    },
                },
                CreateReporteInput: {
                    type: 'object',
                    required: ['tipo', 'descripcion'],
                    properties: {
                        tipo: { type: 'string' },
                        descripcion: { type: 'string' },
                        estado: { type: 'string', enum: ['abierto', 'en_proceso', 'resuelto'] },
                    },
                },
                UpdateReporteInput: {
                    type: 'object',
                    properties: {
                        tipo: { type: 'string' },
                        descripcion: { type: 'string' },
                        estado: { type: 'string', enum: ['abierto', 'en_proceso', 'resuelto'] },
                    },
                },
                HabitoCompletado: {
                    type: 'object',
                    properties: {
                        habito: { type: 'string', description: 'ID del hábito' },
                        completado: { type: 'boolean' },
                    },
                },
                RegistroDiario: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        usuario: { type: 'string', description: 'ID del usuario' },
                        fecha: { type: 'string', format: 'date' },
                        nivelEnergia: { type: 'integer', minimum: 1, maximum: 5 },
                        habitosCompletados: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/HabitoCompletado' },
                        },
                    },
                },
                CreateRegistroDiarioInput: {
                    type: 'object',
                    required: ['fecha', 'nivelEnergia'],
                    properties: {
                        fecha: { type: 'string', format: 'date' },
                        nivelEnergia: { type: 'integer', minimum: 1, maximum: 5 },
                        habitosCompletados: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/HabitoCompletado' },
                        },
                    },
                },
                UpdateRegistroDiarioInput: {
                    type: 'object',
                    properties: {
                        fecha: { type: 'string', format: 'date' },
                        nivelEnergia: { type: 'integer', minimum: 1, maximum: 5 },
                        habitosCompletados: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/HabitoCompletado' },
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                                statusCode: { type: 'integer' },
                            },
                        },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        errors: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    },
                },
                ForgotPasswordInput: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                    },
                },
                ResetPasswordInput: {
                    type: 'object',
                    required: ['token', 'password'],
                    properties: {
                        token: { type: 'string' },
                        password: { type: 'string', minLength: 8 },
                    },
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Token no proporcionado o inválido',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                NotFound: {
                    description: 'Recurso no encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                ServerError: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                BadRequest: {
                    description: 'Error de validación',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ValidationError' },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
