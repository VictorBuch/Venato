/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontSize: {
			xs: ['0.75rem', '1rem'],
			sm: ['0.875rem', '1.25rem'],
			base: ['1rem', '1.5rem'],
			lg: ['1.125rem', '1.75rem'],
			xl: ['1.25rem', '1.75rem'],
			'2xl': ['1.5rem', '2rem'],
			'3xl': ['1.875rem', '2.25rem'],
			'4xl': ['2.25rem', '2.5rem'],
			'5xl': ['3rem', '3rem'],
			'6xl': ['3.75rem', '3.75rem'],
			'7xl': ['4.5rem', '4.5rem']
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				phone: '20px',
				sm: '3.5%',
				md: '5%',
				lg: '7.5%',
				xl: '10%',
				'2xl': '12.5%'
			}
		},
		minWidth: {
			40: '10rem',
			60: '15rem',
			80: '20rem',
			100: '25rem'
		},
		maxWidth: {
			120: '30rem',
			160: '40rem',
			200: '50rem'
		}
	},
	plugins: [require('daisyui'), require('@tailwindcss/line-clamp')],
	daisyui: {
		styled: true,
		themes: [
			'dark',
			{
				cat: {
					primary: '#8caaee',

					secondary: '#99d1db',

					accent: '#ea999c',

					neutral: '#737994',

					'base-100': '#303446',
					'base-200': '#1e2030',
					'base-300': '#181926',

					info: '#8caaee',

					success: '#a6d189',

					warning: '#ef9f76',

					error: '#e78284',
					content: 'c6d0f5'
				},
				green: {
					primary: '#7fef56',

					secondary: '#0eb1d6',

					accent: '#e01692',

					neutral: '#14181F',

					'base-100': '#282F43',

					info: '#698EEC',

					success: '#78E2CA',

					warning: '#F9CC6C',

					error: '#F83037'
				}
			}
		],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: 'mytheme'
	}
};
