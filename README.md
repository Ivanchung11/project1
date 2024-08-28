# project1

## Database Schema

https://drawsql.app/teams/haha-19/diagrams/project-1


## Datasource 


### Basic Data
Gov Cycling Data (main) https://data.gov.hk/tc-data/dataset/hk-td-tis_20-cycling-information
- 單車泊車位 (.kml) https://www.td.gov.hk/datagovhk_tis/cycling-information/CYCPARKSPACE.kmz
- 單車徑 (.kml) https://www.td.gov.hk/datagovhk_tis/cycling-information/CYCTRACK.kmz
- 單車斜路/單車隧道/單車橋 (.kml) https://www.td.gov.hk/datagovhk_tis/cycling-information/CYCRAMP.kmz


康樂及文化事務署轄下場地內飲水機 (main) https://data.gov.hk/tc-data/dataset/hk-lcsd-facwd-fac-wd-list
- 康樂及文化事務署轄下場地內飲水機（英文）(.csv) http://www.lcsd.gov.hk/datagovhk/fac-wd/lcsd_wd_en.csv
路口交通黑點列表 (main) https://data.gov.hk/tc-data/dataset/hk-td-tis_9-junction-blacksite-list
- 路口交通黑點列表(繁體中文) (.csv) https://www.td.gov.hk/datagovhk_td/junction_blacksite_list/resources/tc/junctionblacksite_internet_chi.csv

### Cycling Route Data

- 919 細冷 anti clock small round (.gpx) https://ridewithgps.com/routes/37507702

- Personal Record (.gpx) https://github.com/Ivanchung11/project1/blob/main/test/data/2023-01-23-150805.gpx  


- Extras are in the `test/data` folder


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
