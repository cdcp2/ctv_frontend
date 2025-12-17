/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				ctv: {
					primary: '#0F2C59',    // Azul oscuro institucional
					secondary: '#DAC0A3',  // Beige suave para contrastes
					accent: '#E63946',     // Rojo para alertas/vivo
					dark: '#121212',       // Casi negro para textos
					light: '#F8F9FA',      // Blanco humo para fondos
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Merriweather', 'serif'], // Para el cuerpo de las noticias (se lee mejor)
			}
		},
	},
	plugins: [],
}