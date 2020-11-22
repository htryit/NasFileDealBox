var fs = require("fs");
var path = require("path");

//
var fpathtar = "/volume2/video/han/20201003";
var stat = fs.statSync(fpathtar);
console.log(stat.atime + "," + stat.ctime + "," + stat.mtime);
//

fpathsrc =
  "/volume2/homes/han/Drive/Moments/Mobile/MI CC 9/DCIM/2020-10-03/VID_20201003_150828.mp4";
stat = fs.statSync(fpathsrc);
console.log(stat.atime + "," + stat.ctime + "," + stat.mtime);

fs.utimesSync(fpathtar, stat.atime, stat.mtime);

stat = fs.statSync(fpathtar);
console.log(stat.atime + "," + stat.ctime + "," + stat.mtime);
