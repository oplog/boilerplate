// OpenAPI 3.0 Specification — OPLOG App Builder API
// Manuel spec tanımı (Zod v3 uyumluluğu için @hono/zod-openapi kullanılmıyor)

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "OPLOG App Builder API",
    version: "1.0.0",
    description:
      "OPLOG App Builder Template — Hono.js backend API dokümantasyonu. Cloudflare Zero Trust ile korunan endpoint'ler.",
  },
  servers: [{ url: "/api", description: "API Base" }],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health Check",
        description: "Uygulamanın çalışıp çalışmadığını kontrol eder",
        responses: {
          "200": {
            description: "Uygulama sağlıklı",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      example: "2025-02-13T10:00:00.000Z",
                    },
                    environment: { type: "string", example: "production" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/me": {
      get: {
        tags: ["Auth"],
        summary: "Kullanıcı Bilgisi",
        description:
          "Cloudflare Zero Trust JWT'sinden çıkarılan oturum açmış kullanıcı bilgisi",
        responses: {
          "200": {
            description: "Kullanıcı bilgisi",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
      },
    },
    "/examples": {
      get: {
        tags: ["Examples"],
        summary: "Tüm Örnekleri Listele",
        description: "Pagination ve arama destekli örnek listesi",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Sayfa numarası",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            description: "Sayfa başına kayıt",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "İsim veya açıklamada arama",
          },
        ],
        responses: {
          "200": {
            description: "Başarılı",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Item" },
                    },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Examples"],
        summary: "Yeni Örnek Oluştur",
        description: "Zod validasyonlu yeni kayıt oluşturma",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ItemInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Oluşturuldu",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: { $ref: "#/components/schemas/Item" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/examples/{id}": {
      get: {
        tags: ["Examples"],
        summary: "Tek Örnek Getir",
        description: "ID ile tek kayıt getir",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Başarılı",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: { $ref: "#/components/schemas/Item" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Examples"],
        summary: "Örnek Güncelle",
        description: "Mevcut kaydı kısmi güncelleme (partial update)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ItemInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Güncellendi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    item: { $ref: "#/components/schemas/Item" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Examples"],
        summary: "Örnek Sil",
        description: "Kaydı kalıcı olarak sil",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Silindi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          "404": {
            description: "Bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          email: { type: "string", example: "dev@oplog.com" },
          name: { type: "string", example: "Gelistirici" },
        },
      },
      Item: {
        type: "object",
        properties: {
          id: { type: "string", example: "1" },
          name: { type: "string", example: "Depo Yönetimi Modülü" },
          description: {
            type: "string",
            example: "Depo giriş-çıkış takibi",
            nullable: true,
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-01-15T10:00:00Z",
          },
        },
      },
      ItemInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, example: "Yeni Modül" },
          description: { type: "string", example: "Modül açıklaması" },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            default: "active",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Bulunamadı" },
        },
      },
    },
  },
};
