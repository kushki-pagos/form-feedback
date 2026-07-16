# Sistema de diseño Kushki — Guía para agentes

Este documento transfiere el sistema de tokens, reglas de diseño y voz de marca de Kushki a un proyecto nuevo. Úsalo como contexto de partida antes de hacer cualquier cambio visual.

---

## Tokens de color

```css
:root {
  /* ── KUSHKI GREEN (Brand A) ── */
  --green-p2: #3b9d86;
  --green-p1: #0dc298;
  --green-0:  #00e6b2;
  --green-1:  #00fcc1;
  --green-2:  #b7ffee;

  /* ── KUSHKI BLUE (Brand B) ── */
  --blue-p2: #0e1e2e;
  --blue-p1: #112b45;
  --blue-0:  #023365;
  --blue-1:  #1e65ae;
  --blue-2:  #4498ee;

  /* ── GRISES / NEUTROS ── */
  --light-gray-1: #fbfcfe;
  --light-gray-2: #f7fafc;
  --light-gray-3: #f0f4f8;
  --light-gray-4: #e2e8f0;
  --dark-gray-1:  #c9d3de;
  --dark-gray-2:  #677784;
  --dark-gray-3:  #46525c;
  --dark-gray-4:  #293036;

  /* ── GRADIENTES ── */
  --grad-blue: linear-gradient(45deg, #0a1f44 0%, #1e65ad 60%, #4498ee 100%);
  --grad-teal: linear-gradient(45deg, #023366 0%, #3b9d86 45%, #00d4a0 100%);
  --grad-mint: linear-gradient(45deg, #00d4a0 0%, #00fcc1 100%);
  --degradado-blue: linear-gradient(135deg, #023365 0%, #1e65ae 100%);

  /* ── TIPOGRAFÍA ── */
  --font-display: "Rubik", system-ui, sans-serif;
  --font-ui: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  /* ── RADII ── */
  --r-card: 8px;
  --r-modal: 12px;
  --r-pill: 999px;

  /* ── SPACING (8pt grid) ── */
  --s-1: 4px;   --s-2: 8px;   --s-3: 16px;  --s-4: 24px;
  --s-5: 32px;  --s-6: 48px;  --s-7: 64px;  --s-8: 96px;

  /* ── ELEVACIÓN ── */
  --shadow-elev-1: 0 1px 2px rgba(10,31,68,0.06), 0 0 0 1px rgba(10,31,68,0.04);
  --shadow-elev-2: 0 4px 16px rgba(10,31,68,0.08), 0 0 0 1px rgba(10,31,68,0.04);

  /* ── MOTION ── */
  --ease-k: cubic-bezier(0.2, 0.6, 0.2, 1);
  --dur-fast: 120ms;
  --dur: 200ms;
  --dur-slow: 320ms;
}
```

---

## Reglas de diseño (innegociables)

1. **Solo tokens — cero hex inventados.** Cualquier color, fondo, texto o borde debe usar una variable CSS de la lista de arriba. Prohibido `bg-emerald-500`, `#fff`, o cualquier valor que no venga de este sistema.

2. **Fondos de sección — solo dos opciones:**
   - Sección oscura: `var(--degradado-blue)` o `var(--blue-0)`
   - Sección clara: `var(--light-gray-2)` o `var(--light-gray-3)`
   - Nunca `white` ni `#fff` como fondo de sección.

3. **No dos secciones oscuras seguidas.** Siempre intercalar una sección clara entre dos oscuras.

4. **Colores según fondo:**
   - Fondo oscuro → eyebrow clase `on-dark`, título `#fff`, cuerpo `rgba(255,255,255,0.8)`
   - Fondo claro → eyebrow color `var(--blue-0)`, título `var(--blue-1)`, cuerpo `var(--dark-gray-2)`

5. **Hero siempre azul.** El fondo del hero en páginas interiores es siempre `var(--blue-0)`. El hero siempre lleva `position: relative; overflow: hidden` para el nav transparente.

6. **Botón primario:** `kbtn kbtn-primary kbtn-lg` — nunca agregar flecha manualmente, ya la incluye.

7. **Headings en sentence case.** Solo eyebrows/overlines van en MAYÚSCULAS.

8. **Alineación consistente.** Eyebrow, título y subtítulo siempre alineados entre sí dentro de un bloque. No mezclar alineaciones.

---

## Voz de marca

- **Personalidad:** confiada sin arrogancia, cálida, técnicamente precisa, orgullo latinoamericano.
- **Trato directo:** "tú", "tu negocio" — nunca "usted".
- **Palabras prohibidas:** game-changing, revolucionario, cutting-edge, de vanguardia.
- **Sin emojis** en copy de producto o marketing.
- **Términos que NUNCA se traducen ni alteran:** Kushki One, Shaman, KODA, Kajita, Smartlinks, Billpocket, KODA, "Acceptance Network", "ONE APP. ONE REGION. ALL YOUR PAYMENTS."

---

## Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display / Headings | Rubik | H1–H4, eyebrows |
| UI / Cuerpo | IBM Plex Sans | Párrafos, labels, botones |
| Código | IBM Plex Mono | Snippets, terminales |

---

## Paleta de referencia rápida

| Token | Hex | Uso típico |
|---|---|---|
| `--blue-0` | `#023365` | Fondo hero, CTAs principales |
| `--blue-1` | `#1e65ae` | Títulos en fondo claro, acentos |
| `--blue-2` | `#4498ee` | Links, iconos secundarios |
| `--green-0` | `#00e6b2` | Acento brand, highlights |
| `--light-gray-2` | `#f7fafc` | Fondo sección clara estándar |
| `--light-gray-3` | `#f0f4f8` | Fondo cards, inputs |
| `--dark-gray-2` | `#677784` | Texto cuerpo en fondo claro |
| `--degradado-blue` | `135deg #023365→#1e65ae` | Fondo hero / secciones oscuras |
