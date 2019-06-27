# QrContest 2018
QrContest is an app created for event called IT-DAY 2018 which took place in ZSEO Gniezno high school.

## About QrContest itself
The contest is all about finding and collecting QRs. They were printed and placed in various places in school building.
The task of contestants was to find and scan these codes with smartphone or other device into QrContest app.
Every QR was worth some points, contestant who accumulated the most points won.

Some screens from social media:
<div align="center">
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/post.jpg?raw=true" 
    alt="QrContest poster on ZSEO Gniezno FB page"
    height="450" />
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/poster.jpg?raw=true" 
    alt="QrContest poster on ZSEO Gniezno FB page"
    height="450" />
     <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/qr.jpg?raw=true" 
    alt="QrContest poster on ZSEO Gniezno FB page"
    height="450" />
</div>
<br>

## Contest App - Front-end
The QrContest app was written in ReactJS. This was my first attempt to write anything serious in React and it worked well :)
It's based on React with React Router and axios for communication with dataAPI.

An App is basically 3 screens:
- Sign-in/Sign-up screen
    - Sign-up with name, nick, class and password
    - Sign-in
    - Description and rules of contest
    - Current standings
<br>

- Main screen
    - Username and points
    - Instruction how to scan QR with scanner
    - Collect QR by entering its code
    - All collected QR
    - Current standings
    - Event log (Superuser only)
<div align="center">
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/main.jpg?raw=true" 
    alt="Main screen"
    height="450" />
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/collected.jpg?raw=true" 
    alt="Main screen"
    height="450" />
</div>
<br>
<br>

- QR screen:  QR name, points and optional question
    - Confirmation of the correctness of code (or error in case code not exists)
    - Amount of points added to user account
    - Question (optional, choosen QRs only)
<div align="center">
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/qrcollected.jpg?raw=true" 
    alt="Main screen"
    height="450" />
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/question.jpg?raw=true" 
    alt="Main screen"
    height="450" />
</div>
<br>

## ContestApp - Back-end - dataAPI
Server side of an app was written in pure PHP.
All JSON calls from an app are handled by `request.php` and `QR` class which has methods for every type of action.
Actual data is stored in MySql database.
Backend has ability to render QRs from DB to `.png` files thanks to **phpqrcode** library by Dominik Dzienia.

<div align="center">
    <img 
    src ="https://github.com/roman30098/QrContest2018/blob/master/readmeFiles/scan2.jpg?raw=true" 
    alt="Main screen"
    height="450" />
</div>
