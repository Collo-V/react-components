import type { Config } from "tailwindcss";
import {KeyValuePair, ResolvableTo} from "tailwindcss/types/config";
import {AnyObject} from "collov-js-methods";

type MeasurementDict = ResolvableTo<KeyValuePair<string, string>>
const tempMeasurements:AnyObject={
  'auto': 'auto',
  '0': '0px',
  '1/2': '50%',
  '1/3': '33.33333%',
  '2/3': '66.66667%',
  '1/4': '25%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.66667%',
  '5/6': '83.33333%',
  '9/10': '90%',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '28px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '18': '72px',
  '24': '96px',
  '28': '112px',
  '32': '128px',
  '48': '192px',
  '64': '256px',
  '80':'320px',
  'full': '100%',
  'fit' :'fit-content',
  'min' :'min-content',
  'max' :'max-content',
  'unset' :'unset',
  'initial' :'initial',

  'screen-w': '100vw',
  'screen-w-90': '90vw',
  'screen-w-80': '80vw',

  'screen-h': '100vh',
  'screen-h-90': '90vh',
  'screen-h-80': '80vh',
  'screen-h-70': '70vh',
  'screen-h-60': '60vh',
  'screen-h-50': '50vh',
  'screen-h-40': '40vh',
  'inherit':'inherit'

}

function others(){
  for (let i = 0; i <= 2000; i++) {
    tempMeasurements[`${i.toString()}px`]=`${i}px`
  }
  for (let i = 0; i <= 200; i++) {
    tempMeasurements[`${i.toString()}%`]=`${i}%`
  }
}
others()
const scale:MeasurementDict = {}
for (let i = 0; i < 200; i+=5) {
  scale[i.toString()] = (i/100).toString()
}

const measurements = tempMeasurements as MeasurementDict
module.exports = {
  content: [
    "./src/app/**/*.{tsx,js}",
    "./src/components/**/*.{tsx,js}",
  ],
  darkMode:["class", "class"],
  theme: {
  	extend: {
  		colors: {

  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		spacing: {
                ...measurements
  		},
  		minWidth: {
                ...measurements
  		},
  		minHeight: {
                ...measurements
  		},
  		maxWidth: {
                ...measurements
  		},
  		borderWidth: {
                ...measurements
  		},
  		fontSize: {
                ...measurements
  		},
  		lineHeight: {
                ...measurements
  		},
  		borderRadius: {
  			none: '0',
  			default: '6px',
  			full: '50%',
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			pill: '9999px'
  		},
  		zIndex: {
  			'0': ' 0',
  			'1': '1',
  			'2': '2',
  			'3': '3',
  			'4': '4',
  			'5': '5',
  			'6': '6',
  			'7': '7',
  			'10': ' 10',
  			'20': ' 20',
  			'30': ' 30',
  			'40': ' 40',
  			'50': ' 50',
  			auto: 'auto',
  			n1: '-1',
  			n2: '-2',
  			n3: '-3',
  			n4: '-4',
  			n5: '-5',
  			n6: '-6',
  			n7: '-7',
  			n8: '-8'
  		}
  	}
  },
	prefix:'crc-'
} satisfies Config;
