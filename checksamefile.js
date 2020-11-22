/*
    处理PC10上原来的备份文件

*/
var fs = require("fs");
var path = require("path");
/**/
var targetphotopath = "D:\\Codes\\NasSyncFile\\Test\\TestPhoto";
var targetvideopath = "D:\\Codes\\NasSyncFile\\Test\\TestVideo";
var scriptpath = "D:\\Codes\\NasSyncFile\\logs";
var tmpfolder = "D:\\Codes\\NasSyncFile\\Test\\Tmp";

/* 正式

var targetphotopath = "D:\\Media\\Photo";
var targetvideopath = "D:\\Media\\Video";
var scriptpath = "D:\\Media\\logs";
var tmpfolder = "D:\\Media\\Tmp";
*/

var targetphotopath = "/volume2/photo";
var targetvideopath = "/volume2/video";
var scriptpath = "/volume1/SyncTools/logs";

var logfilepath = "";

var arinfiles = {};

var checkfile = function (fpath) {
  if (fpath.indexOf("@eaDir") != -1) {
    return;
  }

  // console.log(fpath);

  var stats = fs.statSync(fpath);

  if (stats.isFile()) {
    var finfo = path.parse(fpath);
    var extname = finfo.ext.toLowerCase();
    var fname = finfo.name + extname;

    if (arinfiles[fname] == null) {
      //  console.log(fpath + ":first");
      arinfiles[fname] = [fpath];
    } else {
      //  console.log(fpath + ":exist");
      arinfiles[fname].push(fpath);
    }
  } else {
    //文件夹
    findandcheck(fpath);
  }
};

var log = function (fpath) {
  try {
    fs.appendFileSync(logfilepath, new Date() + ":" + fpath + "\r\n");
  } catch (err) {
    /* Handle the error */
  }
};

function getlogname() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("") + "-check.log";
}

var findandcheck = function (fpath) {
  var files = fs.readdirSync(fpath);
  if (files.length != 0) {
    for (var i = 0; i < files.length; i++) {
      var it = files[i];
      var itpath = path.join(fpath, it);
      checkfile(itpath);
    }
  }
};

var start = function () {
  logfilepath = path.join(scriptpath, getlogname());
  //console.log(logfilepath);

  var phtotuserpath = targetphotopath;
  var videouserpath = targetvideopath;

  findandcheck(phtotuserpath);

  findandcheck(videouserpath);

  for (var n in arinfiles) {
    var nv = arinfiles[n];
    if (nv.length > 1) {
      log("\r\n" + n + "\r\n" + nv.join("\r\n") + "\r\n");

      for (var i = 1; i < nv.length; i++) {
        //  fs.copyFileSync(nv[i], path.join(tmpfolder, n));
        fs.unlinkSync(nv[i]);
      }
    }
  }
};

start();
