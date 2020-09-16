# shopapp

### Purpose:
This is a personal project I made during my internship of Summer 2020. It is a working web API for an online shop with full functionality which supports products, categories, carts, reviews, orders and etc. 

It also features an auto-test test suite with GitLab DevOps (It was initially created there)
<br><br>

### Technology Stack

**Node.JS** with **Express** Web-Server connected to an **OracleDB** database was used.

The database was built using Oracle SQL in PLSQL Developer

Here's how the data model looks:

![data model](https://i.ibb.co/K0D1hwH/datamodel.png)


For automated testing **MochaJS, Chai and Sinon** were used

The project also featured CI/CD in GitLab, you can check it out here: https://gitlab.com/adilb99/shopapp

<br><br>

### Front End part of the project:

This app has a front end part developed in **NuxtJS** (based on **VueJS**) which is in a separate repository.

**You can check it out here:** https://github.com/adilb99/shopview


### Latest Update:

This project was initalized in a GitLab repository, but was migrated here for the sake of my convenience, feel free to check out the original repo that features a CI/CD pipeline (but otherwise abandoned after moving here)

https://gitlab.com/adilb99/shopapp


### Future Plans:

- Add OAuth 2.0 authentication
- Better support for different query parameters in each route