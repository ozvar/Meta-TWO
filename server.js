/// to get rid of webkitboundary
/// npm install multiparty


const http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var util = require('util');
var multiparty = require('multiparty');

var log = console.log;

const hostname = '127.0.0.1';
const port = 3000;
const debug = false; 


function filetime() {
const d = new Date();

var dd = d.getDate();
var mm = d.getMonth()+1; //January is 0!
var yyyy = d.getFullYear();
var h =d.getHours()
var m =d.getMinutes()
var sec =d.getSeconds()

if(dd<10){
    dd='0'+dd;
} 
if(mm<10){
    mm='0'+mm;
} 
if(h<10){
    h='0'+h;
} 
if(m<10){
    m='0'+m;
} 
if(sec<10){
    sec='0'+sec;
} 
var ret = yyyy + '-' + mm + '-' + dd + "_" + h + "-" + m + "-" + sec;
return String(ret);
// document.getElementById("DATE").value = today;

}
function contentType(ext) {
    var ct;

    switch (ext) {
    case '.html':
        ct = 'text/html';
        break;
    case '.css':
        ct = 'text/css';
        break;
    case '.js':
        ct = 'text/javascript';
        break;
    default:
        ct = 'text/html';
        break;
    }

    return {'Content-Type': ct};
}
 
const server = http.createServer((req, res) => {
  var dir = "/";
  var uri = url.parse(req.url).pathname;
  if (uri == "/")
  {
    uri = "index.html";
    }
  var filename = path.join(dir, uri);

  var ext = path.extname(filename);
  if(debug === true){
    log(filename);
    log(contentType(ext));  
  }


  if (req.method == 'POST') {
    var form = new multiparty.Form(uploadDir = __dirname + '/data');
    var count = 0;
    var body = '';
//     req.flushHeaders();
//     req.removeHeader('Content-Type');
//     log(req.getHeader('Content-Type'));
    filePath = __dirname + '/data/data_' + module.starttime + '.txt' ;
    
    
//     var stream = fs.appendFile(filePath, body, 'utf8')
    
    
// 
//     form.on('part', function(part) {
//           // You *must* act on the part by reading it
//           // NOTE: if you want to ignore it, just call "part.resume()"
// 
//           if (!part.filename) {
//             // filename is not defined when this is a field and not a file
//             console.log('got field named ' + part.name);
//             fs.appendFile(filePath, part.value, 'utf8');
//             // ignore field's content
//             part.resume();
//           }
// 
// 
//           part.on('error', function(err) {
//             // decide what to do
//           });
//           });
//       form.on('field', function(field){
//             log(field.name);
//             log(field.value);
//             
//       });
// 
//       form.on('close', function() {
//           console.log('Upload completed!');
// //           res.setHeader('text/plain');
//           res.end('Received ' + count + ' files');
//         });
      form.parse(req, function(err,fields,files){
      fs.appendFile(filePath, fields['data'], 'utf8', function() {
            res.end();
        });
      });
      
      
//       function(err, fields, files) {
//       res.writeHead(200, {'content-type': 'text/plain'});
//       res.write('received upload:\n\n');
//       res.end(util.inspect({fields: fields, files: files})
      

//     });
    
    
    // req.on('data', function (data) {
//         body += data;
// 
//         // Too much POST data, kill the connection!
//         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
//         if (body.length > 1e8)
//             req.connection.destroy();
//     });
// 
// 
// 
//     req.on('end', function () {
//         fs.appendFile(filePath, body, 'utf8', function() {
//             res.end();
//         });
//         // use post['blah'], etc.
//     });
  }else {
  
  fs.readFile(__dirname + filename, 
     function (err, data) 
     {
        if (err) 
        {
                res.writeHead(500);
                log(err);
                return res.end('Error loading index.html');
        }
        //log(data);
        if(filename === "/src/MainMenu.js" || filename === "\\src\\MainMenu.js"){
            module.starttime = filetime();
            if(debug === true){
            log("Set starttime");
            }
            }
        if(debug === true){
        log(filename + " has read");
        }
        res.setHeader('content-type', contentType(ext));
        
        res.statusCode = 200;
        res.write(data)
        res.end();
     });
     }
//     var outfile = path.join(dir, "data.txt")
//     var filename = __dirname + outfile
//     fs.sendFile = function(filename, context)
//     {
//         if (fs.exists(filename, function (exists)
//         {
//             if (exists) fs.stat(filename, function (err, stats)
//             {
//                 if (err) core.catch_err(err);
//                 else if (stats && !stats.isDirectory())
//                 {
//                     var filestream = new fs.ReadStream(filename);
//                     var mimme = 'text/plain';
//                     context.res.writeHead(200, {'Content-Type': mimme });
//                     filestream.pipe(context.res);
//                     filestream.on("error", function (err) { context.response.statusCode = "500"; context.response.end("Server error"); core.log("Server error while sending " + filename, "err"); });
//                     context.response.on("close", function () { filestream.destroy(); });
//                     core.logger.log("Sending file " + filename);
//                 }
//             });
//             else core.not_found(context);
//         }));
//     }

    
  });

server.setTimeout(10*60*1000); // 10 * 60 seconds * 1000 msecs
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});




/// TO-DO
// Get node.js to pass button presses to phaser.
// Get data stream to work. 
// 
// 
// core.sendFile = function(filename, context)
// {
//     if (fs.exists(filename, function (exists)
//     {
//         if (exists) fs.stat(filename, function (err, stats)
//         {
//             if (err) core.catch_err(err);
//             else if (stats && !stats.isDirectory())
//             {
//                 var filestream = new fs.ReadStream(filename);
//                 var mimme = mime.lookup(filename);
//                 context.response.writeHead(200, {'Content-Type': mimme });
//                 filestream.pipe(context.response);
//                 filestream.on("error", function (err) { context.response.statusCode = "500"; context.response.end("Server error"); core.log("Server error while sending " + filename, "err"); });
//                 context.response.on("close", function () { filestream.destroy(); });
//                 core.logger.log("Sending file " + filename);
//             }
//         });
//         else core.not_found(context);
//     }));
// }
