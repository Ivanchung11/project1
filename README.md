# project1

Command
```cmd
npm install express
npm install -D @types/express
npm install -D ts-node typescript @types/node ts-node-dev 
npm install pg dotenv
npm install -D @types/pg
npm install express-session
npm install -D @types/express-session
```

package.json
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "es6",
    "lib": ["es6"],
    "esModuleInterop": true,
    "moduleResolution": "node",
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "outDir": "dist"
  },
  "exclude": ["dist"]
}

"scripts": {
	"start": "ts-node app.ts"
}
```




.gitginore
```
node_modules/
.env
```
