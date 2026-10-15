# Prueba visual de párrafos

Desde `ctv_frontend`, instala las dependencias y el navegador una vez:

```bash
npm ci
npx playwright install chromium
```

Ejecuta la prueba y abre el informe:

```bash
npm run test:e2e -- paragraphs.spec.ts
npx playwright show-report
```

El informe incluye cuatro casos con capturas adjuntas: texto y HTML existente,
en escritorio (1280 px) y móvil (390 px). Abre cada caso y su captura en
`Attachments`. Se verifica la separación visible entre tres párrafos, el salto
de línea interno, los símbolos del texto, los enlaces y las negritas existentes,
y que el contenido no desborde horizontalmente.

Para observar la ejecución en una ventana del navegador:

```bash
npm run test:e2e -- paragraphs.spec.ts --headed
```

Playwright inicia y detiene automáticamente el frontend y una API de prueba
local. Los puertos 3000 y 4321 deben estar libres. No utiliza ni modifica datos
de producción. Las capturas y el informe se generan en `test-results/` y
`playwright-report/`, excluidos de Git.

Si Chromium se instaló en una ruta personalizada, usa el mismo valor de
`PLAYWRIGHT_BROWSERS_PATH` al ejecutar la prueba.
