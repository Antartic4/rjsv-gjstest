
## Getting Started

Hello, this is a platform for website building storage.
First, run the development server:

# 1st
```bash
npm install
```

# 2nd
Create a ".env" in the project's root directory. 
```bash
DATABASE_URL="mongodb+srv://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>" <- change
NEXTAUTH_SECRET= 'PutAnythingComplicated' <- change
NEXTAUTH_URL=https://rjsv-gjstest-production.up.railway.app <- change
```

# 3rd
```bash
npm run dev
# or
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
