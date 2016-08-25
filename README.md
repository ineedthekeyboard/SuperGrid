# SuperGrid
A super simple jQuery plugin to render a grid out of an array of data.
***************

### Compile Development Site and Docs
1) Clone the Git Repository
> git clone https://github.com/ineedthekeyboard/supergrid.git

2) Install Dev Tools (From the root directory of the project. Make sure node is installed):
> npm install

3) Serve the samples and documentation on localhost (Make sure no other applications are listening on Port 8080 or 8081):
> gulp serve

- The Demo application is available at: http://localhost:8080/index.html
- The Documentation for the grid available at http://localhost:8081/index.html

### Online Documentation For Code:
See the code documentation here: https://ineedthekeyboard.github.io/supergrid/
***************

### Production & Distribution
***************
In the dist folder you will find the latest build for inclusion in your own website and projects.
If you find that you need to build your own file for distribution run the following command after cloning the projects
> gulp build

This will update the distribution files in the dist folder. Generally, you will need to include jquery, and jquery UI into on the
pages where you intend to use SuperGrid (one day this will not be the case...but for now it is)
