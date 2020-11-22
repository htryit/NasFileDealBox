/*
    处理PC10上原来的备份文件

*/
var fs = require("fs");
var path = require("path");
/*
var targetphotopath = "D:\\Codes\\NasSyncFile\\Test\\TestPhoto";
var targetvideopath = "D:\\Codes\\NasSyncFile\\Test\\TestVideo";
var scriptpath = "D:\\Codes\\NasSyncFile\\logs";
var tmpfolder = "D:\\Codes\\NasSyncFile\\Test\\Tmp";
 */
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

  return [year, month, day].join("") + "-delemptyfolder.log";
}

var findandcheck = function (fpath) {
  var files = fs.readdirSync(fpath);
  if (files.length != 0) {
    var hasfiles = false;
    for (var i = 0; i < files.length; i++) {
      var it = files[i];
      var itpath = path.join(fpath, it);

      var stats = fs.statSync(itpath);
      if (stats.isFile()) {
        hasfiles = true;
        continue;
      } else {
        if (itpath.indexOf("@eaDir") == -1) {
          var chksub = findandcheck(itpath);
          if (chksub) {
            hasfiles = true;
          }
        }
      }
    }

    console.log(fpath + ":" + hasfiles);

    if (!hasfiles) {
      log(fpath);
      fs.rmdirSync(fpath, { recursive: true });
      return false;
    } else {
      return true;
    }
  } else {
    //empty,remove
    log(fpath);
    fs.rmdirSync(fpath, { recursive: true });
    return false;
  }
};

var start = function () {
  logfilepath = path.join(scriptpath, getlogname());

  var phtotuserpath = targetphotopath;
  var videouserpath = targetvideopath;

  findandcheck(phtotuserpath);

  findandcheck(videouserpath);
};

start();
