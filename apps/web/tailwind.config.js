/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                mais: {
                    orange: '#f58f2a',
                    navy: '#0c2444',
                    red: '#f15424',
                    blue: '#14244c',
                },
                // Alias para compatibilidade inicial
                votorantim: {
                    blue: '#0c2444',
                    green: '#f58f2a',
                    yellow: '#f15424',
                },
            },
        },
    },
    plugins: [],
};
