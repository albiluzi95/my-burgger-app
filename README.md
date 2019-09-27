# Material Zhvillimi  per krijimin e aplikacionit ‘Burger App’ dhe per integrimin CI/CD
## Rreth aplikacionit Burger App:
Ky aplikim eshte ndërtuar duke përdorur react.js dhe eshte nje implimentim qe përdor paketat bazike te saj por edhe paketa te tjera 
sic jane
*	Webpack.js
*	Redux
*	Eslint
*	Enzyme (per ambjente tesing)
*	Jest 
*	Babel
*	Axios 
Në vetvete ky është nje serveless app, pra nuk ka nevojë për nje backend ku te menaxhohet  “Bussiness Workflow” por në vend të saj 
eshte përdorur Firebase si nje system Provider ku perdoren disa sherbime si: Databaza dhe hosting provider .
                ![React Fire](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/reactfire.PNG)
Rreth Integrimit të vazhdueshem dhe integrimit si nje mjet per te arritur kete lloje sherbimi eshte perdorur Circleci pasi mundeson 
disa lehtesira dhe konfigurime ‘pre-built-in’ qe menaxhohen edhe nga firebase.
# Detaje mbi zhvillimin
Fillimisht duhet konfiguruar Firebase në mënyrë që të kemi nje deploy te pare.
Per kete perdoret nje mjet te cilen e kemi ruajtur lokalisht qe quhet [firebase-tools](https://www.npmjs.com/package/firebase-tools) 
Në një Cmd cfaredo ekzekutojme komanden firebase login e cila hape nje dritare ne browser në të cilën validojmë vlefshmerine tonë si përdorues.
 Ezkekutojmë komanden `firebase init` ku na shfqen opsinet e mëposhtëm.
``` ? Which Firebase CLI features do you want to set up for this folder? Press Space to select features, then Enter to confirm your choices. 
 ( ) Database: Deploy Firebase Realtime Database Rules
 ( ) Firestore: Deploy rules and create indexes for Firestore
 ( ) Functions: Configure and deploy Cloud Functions
>(*) Hosting: Configure and deploy Firebase Hosting sites
 ( ) Storage: Deploy Cloud Storage security rules
 ```
Ku neve na duhet pjesa  e ‘Hosting’e cila eshte e selektuar me *.
Pas kësaj na duhet ti asenjojme aplikacionin tone në firebase e cila është `albi-burgger-app.`
Duhet te specifikojme se cili file është për prodhim  e cila është file `/build`
Në keto moment firebase do jape nje pergjigje qe projekti eshte inicializuar ne projektin tone lokal.
Ne menyre qe qe ta çojmë për prodhim duhet te ekzekutojmë  komandat:
`Npm run build`
`Firebase deploy`


Pasë kesaj do na jepet nje përgjigje që deploy u krye me sukses dhe do jepet linku i hostit si me poshte:
                   ![Firebase Deploy](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/firebaseDeploy.PNG)


# Configurimi i CircleCi
Duhet qe te hapim account-in tonë te  [Circle ci](http://circleci.com) 
Duhet qe ti japim circleci te drejta ne repositorin tonë 
 ![Add Project](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/addproject.png)

Pasë kësaj do na hapet nje faqe tjeter ku duhet të zgjedhim llojin e makinës virtuale dhe gjuhën e programimit.
 ![Add System](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/AddSystem.jpeg)
# Configurimi i instruksioneve në aplikacionin tonë
Duke u bazuar në dokumentin në faqen e circle-ci,  fillohet duke krijuar një file .circleci dhe brenda saj një file config.yml.
Brënda atij file vendoset kodi i mëposhtëm e cila mban setin e konfigurimeve që kryhen.
```
lversion: 2
jobs:
  build:
    docker:
      # specify the version you desire here
      - image: circleci/node:11
    working_directory: ~/repo
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - v1-dependencies-
      - run: npm install
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      # run tests!
      - run: npm run test
      - run:
          name: Build Project Burgger app
          command: npm run build
      - run:
          name: Deploy to Firebase Hosting
          command: ./node_modules/.bin/firebase use $FIREBASE_ALIAS
```
 
1.	Deklarimi i versionit, versioni 2
2.	Krijimi i ‘jobit’. Në këtë raste kemi një job që e kemi për kete repo ne te cilen kryejmë veprimet e mëposhtëme.
3.	Deklarojme një ambjent Docker bashke me imazhin përkatës që është circleci/node:11
4.	Fillojmë me deklarimin e hapave qe do kete ky ‘job’ të cilat janë checkout  ku nëqoftëse paketat e jashtëme janë të instaluara në kashe të këtij imazhi ti marrë prej andej perndryshe të kryejë komandën ‘npm install’
5.	Ekzekutohet komdanda ‘npm run test’ e cila nëqoftëse kalon me sukses do vazhdoje te veprimi tjetër, përdryshe do gjenerojë error
6.	Hapi pasardhes eshte krijimi i filet dist duke gjeneruar filet qe do perdoren per production
7.   Dergimi i filet te dist ne ambjentin ne firebase e cila ndodhet ne nje remote, per kete perdoret nje variable globale e cila eshte $FIREBASE_ALIAS e cila ruan celesin tone te hashuar e cila perdoret nga CircleCi dhe Firebase.
# Konfigurimi i celësit tonë
Në cmd  tonë lokal ekzekutojmë komandën firebase login:ci
Pasi kemi bere hyrjen nga nje browser do na jepet celesi jone te cilen Firebase e njeh personalisht nga vete circleci. 
Shkojme te ‘settings’ I circleci  dhe vemi te ‘settings’ I projektit tone
 ![Settings](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/settingsci.PNG)
Shkojme te pjesa ‘Enviorment variables’ dhe hedhim nje variable te ri me emrin e FIREBASE_ALIAS dhe me vlere celesin tone qe u gjenerua.
![Add Variable](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/varci.PNG)
 
Ne keto moment  mund te bejme deploy manual nga nderfaqja e circleci dhe do jepet nje response si me poshte.
 ![Success](https://github.com/albiluzi95/my-burgger-app/blob/master/src/assets/docs/success.PNG)

Referenca:
* [Firebase](https://firebase.google.com/docs/hosting)
* [Circle ci](https://circleci.com/docs/2.0)
* [http://www.freepatentsonline.com/10120670.html](http://www.freepatentsonline.com/10120670.html)
* [http://www.freepatentsonline.com/10120670.pdf](http://www.freepatentsonline.com/10120670.pdf)

