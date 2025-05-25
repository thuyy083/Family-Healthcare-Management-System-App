module.exports = {
   root: true,
  parser: '@babel/eslint-parser', // 👈 thêm dòng này
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false, // cần thiết khi dùng babel-eslint
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'prettier/prettier': 'warn',
    'semi': 'off', // Không bắt buộc dấu chấm phẩy
    'quotes': ['warn', 'single'], // Dấu nháy đơn
    'no-unused-vars': 'warn', // Cảnh báo biến không dùng
    'react/prop-types': 'off' // Tắt kiểm tra prop-types nếu dùng TS
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
